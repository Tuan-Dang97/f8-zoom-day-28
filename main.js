class VietnameseMusicPlayer {
    constructor() {
        this.songs = [
            {
                id: 1,
                title: "Chạy ngay đi",
                artist: "Sơn Tùng M-TP",
                cover: "🔥",
                url: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3"
            },
            {
                id: 2,
                title: "Nơi này có anh",
                artist: "Sơn Tùng M-TP", 
                cover: "💖",
                url: "https://sample-music.netlify.app/death%20bed.mp3"
            },
            {
                id: 3,
                title: "Hãy trao cho anh",
                artist: "Sơn Tùng M-TP ft. Snoop Dogg",
                cover: "🌟",
                url: "https://sample-music.netlify.app/until%20i%20found%20you.mp3"
            },
            {
                id: 4,
                title: "Lạc trôi",
                artist: "Sơn Tùng M-TP",
                cover: "🌊",
                url: "https://www.soundjay.com/misc/bell-ringing-05.wav"
            },
            {
                id: 5,
                title: "Em gì ơi",
                artist: "Jack & K-ICM",
                cover: "❤️",
                url: "https://sample-music.netlify.app/see%20you%20again.mp3"
            },
            {
                id: 6,
                title: "Bạc phận",
                artist: "Jack & K-ICM",
                cover: "💔",
                url: "https://file-examples.com/storage/fe68c2b7875c38cd5bb9c1d/2017/11/file_example_MP3_700KB.mp3"
            },
            {
                id: 7,
                title: "Sóng gió",
                artist: "Jack & K-ICM",
                cover: "🌪️",
                url: "https://sample-music.netlify.app/lovely.mp3"
            },
            {
                id: 8,
                title: "Anh đã quen với cô đơn",
                artist: "Soobin Hoàng Sơn",
                cover: "😢",
                url: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3"
            }
        ];
        
        this.currentSongIndex = 0;
        this.isPlaying = false;
        this.isShuffled = false;
        this.isRepeated = false;
        
        this.initElements();
        this.initEventListeners();
        this.renderPlaylist();
        this.loadSong(0);
    }
    
    initElements() {
        this.audio = document.getElementById('audioPlayer');
        this.playBtn = document.getElementById('playBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.repeatBtn = document.getElementById('repeatBtn');
        this.progressBar = document.getElementById('progressBar');
        this.progress = document.getElementById('progress');
        this.currentTimeEl = document.getElementById('currentTime');
        this.totalTimeEl = document.getElementById('totalTime');
        this.currentSongEl = document.getElementById('currentSong');
        this.albumArtEl = document.getElementById('albumArt');
        this.playlistEl = document.getElementById('playlist');
    }
    
    initEventListeners() {
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.prevSong());
        this.nextBtn.addEventListener('click', () => this.nextSong());
        this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        this.repeatBtn.addEventListener('click', () => this.toggleRepeat());
        this.progressBar.addEventListener('click', (e) => this.seek(e));
        
        // Real audio events
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.handleSongEnd());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            this.playBtn.textContent = '⏸';
        });
        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
            this.playBtn.textContent = '▶';
        });
    }
    
    renderPlaylist() {
        this.playlistEl.innerHTML = '';
        this.songs.forEach((song, index) => {
            const item = document.createElement('div');
            item.className = 'playlist-item';
            item.innerHTML = `
                <div class="playlist-album">${song.cover}</div>
                <div class="playlist-info">
                    <div class="song-name">${song.title}</div>
                    <div class="song-artist">${song.artist}</div>
                </div>
                <button class="more-btn">⋯</button>
            `;
            
            item.addEventListener('click', () => this.loadSong(index));
            this.playlistEl.appendChild(item);
        });
        this.updateActiveItem();
    }
    
    loadSong(index) {
        if (index >= 0 && index < this.songs.length) {
            this.currentSongIndex = index;
            const song = this.songs[index];
            
            this.audio.src = song.url;
            this.currentSongEl.textContent = song.title;
            this.albumArtEl.innerHTML = song.cover;
            this.albumArtEl.className = 'album-art';
            
            this.updateActiveItem();
        }
    }
    
    togglePlay() {
        // Always use demo mode for reliable playback
        if (this.isPlaying) {
            this.stopDemoMode();
            this.isPlaying = false;
            this.playBtn.textContent = '▶';
        } else {
            this.startDemoMode();
        }
    }
    
    // Demo mode for reliable music simulation
    startDemoMode() {
        this.isPlaying = true;
        this.playBtn.textContent = '⏸';
        this.demoTime = 0;
        this.demoDuration = 180 + Math.floor(Math.random() * 60); // 3-4 minutes
        this.totalTimeEl.textContent = this.formatTime(this.demoDuration);
        
        this.demoInterval = setInterval(() => {
            this.demoTime += 1;
            this.currentTimeEl.textContent = this.formatTime(this.demoTime);
            const progress = (this.demoTime / this.demoDuration) * 100;
            this.progress.style.width = Math.min(progress, 100) + '%';
            
            if (this.demoTime >= this.demoDuration) {
                this.handleSongEnd();
            }
        }, 1000);
    }
    
    stopDemoMode() {
        if (this.demoInterval) {
            clearInterval(this.demoInterval);
            this.demoInterval = null;
        }
    }
    
    prevSong() {
        this.stopDemoMode();
        let newIndex = this.currentSongIndex - 1;
        if (newIndex < 0) {
            newIndex = this.songs.length - 1;
        }
        this.loadSong(newIndex);
        if (this.isPlaying) {
            setTimeout(() => this.togglePlay(), 100);
        }
    }
    
    nextSong() {
        this.stopDemoMode();
        let newIndex;
        if (this.isShuffled) {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } else {
            newIndex = (this.currentSongIndex + 1) % this.songs.length;
        }
        this.loadSong(newIndex);
        if (this.isPlaying) {
            setTimeout(() => this.togglePlay(), 100);
        }
    }
    
    handleSongEnd() {
        this.stopDemoMode();
        if (this.isRepeated) {
            this.audio.currentTime = 0;
            this.togglePlay();
        } else {
            this.nextSong();
        }
    }
    
    toggleShuffle() {
        this.isShuffled = !this.isShuffled;
        this.shuffleBtn.style.opacity = this.isShuffled ? '1' : '0.6';
    }
    
    toggleRepeat() {
        this.isRepeated = !this.isRepeated;
        this.repeatBtn.style.opacity = this.isRepeated ? '1' : '0.6';
    }
    
    seek(e) {
        if (this.demoInterval) {
            // Demo mode seeking
            const rect = this.progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const clickRatio = clickX / width;
            this.demoTime = clickRatio * this.demoDuration;
            this.currentTimeEl.textContent = this.formatTime(this.demoTime);
            const progress = (this.demoTime / this.demoDuration) * 100;
            this.progress.style.width = Math.min(progress, 100) + '%';
        } else if (this.audio.duration) {
            const rect = this.progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const clickRatio = clickX / width;
            this.audio.currentTime = clickRatio * this.audio.duration;
        }
    }
    
    updateProgress() {
        if (this.audio.duration) {
            const progressPercent = (this.audio.currentTime / this.audio.duration) * 100;
            this.progress.style.width = progressPercent + '%';
            this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
        }
    }
    
    updateDuration() {
        if (this.audio.duration) {
            this.totalTimeEl.textContent = this.formatTime(this.audio.duration);
        }
    }
    
    updateActiveItem() {
        const items = this.playlistEl.querySelectorAll('.playlist-item');
        items.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentSongIndex);
        });
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}

// Initialize the music player
const player = new VietnameseMusicPlayer();