import { Request, Response } from 'koa';
import {
  Controller,
  QueryParam,
  Get,
  Post,
  Redirect,
  Req,
  Res,
  BodyParam,
} from 'routing-controllers';

@Controller('/v1/oauth2')
export class OAuth2Controller {}
