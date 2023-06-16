import { type Response } from 'express'

export const badRequest = <T>(res: Response, body: T): Response => res.status(400).json(body)

export const created = <T>(res: Response, body: T): Response => res.status(201).json(body)

export const ok = <T>(res: Response, body: T): Response => res.status(200).json(body)

export const noContent = (res: Response): Response => res.status(204).send()

export const notFound = <T>(res: Response, body: T): Response => res.status(404).json(body)

export const internalServerError = <T>(res: Response, body: T): Response => res.status(500).json(body)

export const conflict = <T>(res: Response, body: T): Response => res.status(409).json(body)

export const notAuthorized = <T>(res: Response, body: T): Response => res.status(401).json(body)
