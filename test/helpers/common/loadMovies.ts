import { PrismaService } from 'src/modules/prisma/prisma.service'
import movies from '../../../data/movies.json'

export async function loadMovies(prisma: PrismaService) {
  const movieIds = movies.map((m) => ({ imdbId: m.id }))

  await prisma.movieRecord.createMany({
    data: movieIds,
  })
}
