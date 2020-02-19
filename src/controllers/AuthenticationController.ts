import { Request, Response } from 'express';
import { Controller, QueryParam, Get, Post, Redirect, Req, Res, BodyParam } from 'routing-controllers';
import uuid from 'uuid/v4';
import jwt from 'jsonwebtoken';

@Controller('/v1/authentication')
export class AuthenticationController {
}
