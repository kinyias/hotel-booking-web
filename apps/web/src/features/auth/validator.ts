import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .email({
      message: 'Vui lòng điền email hợp lệ',
    })
    .nonempty('Email không được để trống'),
  password: z
    .string()
    .min(8, {
      message: 'Mật khẩu phải có ít nhất 8 kí tự',
    })
    .regex(/[a-z]/, {
      message: 'Mật khẩu phải có ít nhất một chữ cái thường (a-z)',
    })
    .regex(/[A-Z]/, {
      message: 'Mật khẩu phải có ít nhất một chữ cái hoa (A-Z)',
    })
    .regex(/[0-9]/, {
      message: 'Mật khẩu phải có ít nhất một chữ số (0-9)',
    })
    .regex(/[!@#$%^&*]/, {
      message:
        'Mật khẩu phải có ít nhất một ký tự đặc biệt (!, @, #, $, %, ^, &, *)',
    })
    .nonempty('Mật khẩu không được để trống'),
});

export const registerSchema = z
  .object({
    firstName: z.string().nonempty('Họ không được để trống'),
    lastName: z.string().nonempty('Tên không được để trống'),
    email: z
      .string()
      .email({
        message: 'Vui lòng điền email hợp lệ',
      })
      .nonempty('Email không được để trống'),
    password: z
      .string()
      .min(8, {
        message: 'Mật khẩu phải có ít nhất 8 kí tự',
      })
      .regex(/[a-z]/, {
        message: 'Mật khẩu phải có ít nhất một chữ cái thường (a-z)',
      })
      .regex(/[A-Z]/, {
        message: 'Mật khẩu phải có ít nhất một chữ cái hoa (A-Z)',
      })
      .regex(/[0-9]/, {
        message: 'Mật khẩu phải có ít nhất một chữ số (0-9)',
      })
      .regex(/[!@#$%^&*]/, {
        message:
          'Mật khẩu phải có ít nhất một ký tự đặc biệt (!, @, #, $, %, ^, &, *)',
      })
      .nonempty('Mật khẩu không được để trống'),
    confirmPassword: z
      .string()
      .nonempty('Xác nhận mật khẩu không được để trống'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });
