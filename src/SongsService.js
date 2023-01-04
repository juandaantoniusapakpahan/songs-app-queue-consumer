const { Pool } = require('pg');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async getSongs(playlistId) {
    const query = {
      text: 'SELECT id, name FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const songs = {
      text: `SELECT sg.id, sg.title, sg.performer FROM playlist_songs ps
            LEFT JOIN songs sg ON ps.song_id = sg.id
            WHERE ps.playlist_id = $1`,
      values: [playlistId],
    }

    const resultPlaylist = await this._pool.query(query);
    const resultSong = await this._pool.query(songs);

    resultPlaylist.rows[0].songs = resultSong.rows;

    const result = { playlist: resultPlaylist.rows[0] };

    return result;
  }
}

module.exports = SongsService;
