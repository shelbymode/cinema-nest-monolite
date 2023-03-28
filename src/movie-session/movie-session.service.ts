import { Injectable } from '@nestjs/common'
import { MovieSession, Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { UpdateMovieSessionDto } from './dto/update-movie-session.dto'

@Injectable()
export class MovieSessionService {
  constructor(private readonly prisma: PrismaService) {}

  async createMovieSession({
    startDate,
    endDate,
    movieId,
    cinemaId,
  }: {
    startDate: Date
    endDate: Date
    movieId: number
    cinemaId: number
  }): Promise<MovieSession> {
    return await this.prisma.movieSession.create({
      data: { startDate, endDate, movieId, cinemaId },
    })
  }

  async findOverlappingMovieSession({
    startDate,
    endDate,
    cinemaId,
    timeGapBetweenMovieSession,
  }: {
    startDate: Date
    endDate: Date
    cinemaId: number
    timeGapBetweenMovieSession: number
  }) {
    const overlappingMovieSession = await this.prisma.movieSession.findMany({
      where: {
        OR: [
          {
            startDate: {
              gte: startDate,
              lte: new Date(endDate.getTime() + timeGapBetweenMovieSession * 60000),
            },
            cinemaId,
          },
          {
            endDate: {
              gte: new Date(startDate.getTime() - timeGapBetweenMovieSession * 60000),
              lte: endDate,
            },
            cinemaId,
          },
        ],
      },
    })

    return overlappingMovieSession
  }

  async findAllMovieSessions(): Promise<MovieSession[]> {
    return await this.prisma.movieSession.findMany()
  }

  async findOneMovieSession(id: number): Promise<MovieSession | null> {
    return await this.prisma.movieSession.findUnique({ where: { id } })
  }

  async updateMovieSession(id: number, updateMovieSessionDto: UpdateMovieSessionDto): Promise<MovieSession> {
    return await this.prisma.movieSession.update({ where: { id }, data: updateMovieSessionDto })
  }

  async deleteMovieSession(id: number): Promise<MovieSession> {
    return await this.prisma.movieSession.delete({ where: { id } })
  }

  async resetMoviesSessions(cinemaId: number): Promise<Prisma.BatchPayload> {
    return await this.prisma.movieSession.deleteMany({ where: { cinemaId } })
  }
}
