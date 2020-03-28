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

@Controller('/v1/applications')
export class ApplicationController {}
