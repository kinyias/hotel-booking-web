import { SetMetadata } from '@nestjs/common';
export const ACTION_KEY = 'action_key';
export const Action = (key: string) => SetMetadata(ACTION_KEY, key);
