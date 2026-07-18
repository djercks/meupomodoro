import { useCallback, useEffect, useRef, useState } from 'react'

export function extractYouTubeId(url) {
  if (!url) return null
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/
  )
  return match ? match[1] : null
}

function loadYouTubeAPI() {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) return resolve(window.YT)
    if (!document.getElementById('youtube-iframe-api')) {
      const tag = document.createElement('script')
      tag.id = 'youtube-iframe-api'
      tag.src = 'https://www.youtube.com/iframe_api'
      document.body.appendChild(tag)
    }
    const previous = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previous?.()
      resolve(window.YT)
    }
  })
}

export function useYouTubePlayer(initialUrl = '') {
  const containerRef = useRef(null)
  const playerRef = useRef(null)
  const [videoId, setVideoId] = useState(() => extractYouTubeId(initialUrl))
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!videoId || !containerRef.current) return undefined
    let cancelled = false

    loadYouTubeAPI().then((YT) => {
      if (cancelled) return
      if (playerRef.current) {
        playerRef.current.loadVideoById(videoId)
        setPlaying(true)
        return
      }
      playerRef.current = new YT.Player(containerRef.current, {
        videoId,
        width: '100%',
        height: '100%',
        playerVars: { autoplay: 1, controls: 1, rel: 0 },
        events: {
          onStateChange: (e) => setPlaying(e.data === 1),
        },
      })
    })

    return () => {
      cancelled = true
    }
  }, [videoId])

  const loadUrl = useCallback((url) => {
    const id = extractYouTubeId(url)
    if (!id) return false
    setVideoId(id)
    return true
  }, [])

  const togglePlay = useCallback(() => {
    if (!playerRef.current) return
    if (playing) playerRef.current.pauseVideo()
    else playerRef.current.playVideo()
  }, [playing])

  const stopAndClear = useCallback(() => {
    playerRef.current?.stopVideo?.()
    setVideoId(null)
    setPlaying(false)
  }, [])

  const setVolume = useCallback((v) => {
    playerRef.current?.setVolume?.(v)
  }, [])

  return { containerRef, videoId, playing, loadUrl, togglePlay, stopAndClear, setVolume }
}
