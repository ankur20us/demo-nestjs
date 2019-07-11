import { createParamDecorator } from '@nestjs/common';

/**
 * This decorator or annotation is basically for controllers, in REST context
 * since if you use this annotation you can have the context object.
 */
export const UserDecorator = createParamDecorator((key, req) => {
  return key ? req.user[key] : req.user;
});
