import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { ListContactDto } from './dto/list-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Prisma } from '@prisma/client';
import { MailService } from '../mail/mail.service'; // nếu bạn đã có mail module

@Injectable()
export class ContactService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
  ) {}

  async create(
    dto: CreateContactDto,
    meta: { ip?: string; userAgent?: string },
  ) {
    if (!dto.email && !dto.phone) {
      throw new BadRequestException(
        'Vui lòng để lại email hoặc số điện thoại để chúng tôi liên hệ lại.',
      );
    }

    const row = await this.prisma.contactMessage.create({
      data: {
        name: dto.name,
        email: dto.email ?? null,
        phone: dto.phone ?? null,
        subject: dto.subject ?? null,
        message: dto.message,
        ip: meta.ip ?? null,
        userAgent: meta.userAgent ?? null,
      },
    });

    // Gửi mail thông báo cho support/admin (best-effort)
    await this.mail.sendContactNotification({
      id: row.id,
      name: row.name,
      email: row.email ?? undefined,
      phone: row.phone ?? undefined,
      subject: row.subject ?? undefined,
      message: row.message,
      createdAt: row.createdAt,
    });

    return { id: row.id, ok: true };
  }

  async list(q: ListContactDto) {
    const limit = q.limit ?? 20;
    const page = q.page ?? 1;
    const offset = (page - 1) * limit;

    const where: Prisma.ContactMessageWhereInput = {
      ...(q.status ? { status: q.status as any } : {}),
      ...(q.q
        ? {
            OR: [
              { name: { contains: q.q, mode: 'insensitive' } },
              { email: { contains: q.q, mode: 'insensitive' } },
              { phone: { contains: q.q, mode: 'insensitive' } },
              { subject: { contains: q.q, mode: 'insensitive' } },
              { message: { contains: q.q, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.contactMessage.findMany({
        where,
        take: limit,
        skip: offset,
        include: {
          handledBy: {select: {id: true, email: true}},
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.contactMessage.count({ where }),
    ]);

    return {
      data,
      meta: {
        limit,
        offset,
        total,
      },
    };
  }

  async get(id: string) {
    const row = await this.prisma.contactMessage.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Contact not found');
    return row;
  }

  async update(id: string, dto: UpdateContactDto) {
    const exists = await this.prisma.contactMessage.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException('Contact not found');

    return this.prisma.contactMessage.update({
      where: { id },
      data: {
        status: dto.status as any,
        handledById: dto.handledById ?? undefined,
        note: dto.note ?? undefined,
      },
    });
  }
}
