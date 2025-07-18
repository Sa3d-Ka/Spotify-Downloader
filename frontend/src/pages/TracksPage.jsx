import React from 'react'
import StepTracker from '../components/StepTracker'
import { useParams } from 'react-router-dom'
import { usePlaylistContext } from '../context/PlaylistContext';

const TracksPage = () => {

  const { id } = useParams();
  const { playlists } = usePlaylistContext();
  const playlist = playlists.find(pl=> pl.id === id)
  const tracks = playlist.tracks

  return (
    <div>
      <StepTracker currentStep={2} />
      <div className='flex justify-between mx-80'>
      <h2>{playlist.name}</h2>
      <p>{playlist.tracks.length > 1 ? `${playlist.tracks.length} Tracks` : `${playlist.tracks.length} Track`}</p>
      </div>
    </div>
  )
}

export default TracksPage
