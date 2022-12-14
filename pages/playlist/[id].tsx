import GradientLayout from '../../components/GradientLayout'
import prisma from '../../lib/prisma'
import { validateToken } from '../../lib/auth'
import SongsTable from '../../components/SongsTable'

const getBGColor = (id) => {
  const colors = [
    'red',
    'green',
    'blue',
    'purple',
    'orange',
    'gray',
    'teal',
    'yellow',
  ]

  return colors[id - 1] || colors[Math.floor(Math.random() * colors.length)]
}

const Playlist = ({ playlist }) => {
  return (
    <GradientLayout
      color={getBGColor(playlist.id)}
      description={`${playlist.songs.length} songs`}
      image={`https://picsum.photos/400?random=${playlist.id}`}
      roundImage={false}
      subtitle="playlist"
      title={playlist.name}
    >
      <SongsTable songs={playlist.songs} />
    </GradientLayout>
  )
}

export const getServerSideProps = async ({ query, req }) => {
  let user

  try {
    user = validateToken(req.cookies.TRAX_ACCESS_TOKEN)
  } catch (e) {
    return {
      permanent: false,
      path: '/signin',
    }
  }

  const [playlist] = await prisma.playlist.findMany({
    where: {
      id: +query.id, // playlist id
      userId: user.id,
    },
    include: {
      songs: {
        include: {
          artist: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
    },
  })

  return {
    props: {
      playlist,
    },
  }
}

export default Playlist
