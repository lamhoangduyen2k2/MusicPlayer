const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const cd = $('.cd')
const nameSong = $('.title-music')
const imageCD = $('.cd-thumb')
const audioSong = $('#audio')
const btnPlay = $('.btn-toggle-play')
const progressBar = $('.progress')
const btnNext = $('.btn-next')
const btnPrev = $('.btn-prev')
const btnRandom = $('.btn-random')
const btnRepeat = $('.btn-repeat')
const playlist = $('.playlist')



const app = {
        currentIndex: 0,
        isPlaying: false,
        isRandom: false,
        isRepeat: false,
        songs: [
            {
                name: 'Lâu Lâu Nhắc Lại',
                singer: 'Hà Nhi ft Khói',
                path: './assets/music/laulaunhaclai.mp3',
                image: './assets/picture/llnl_HaNhiftKhoi.jpg'
            },
            {
                name: 'Một Ngày Chẳng Nắng',
                singer: 'Pháo ft Thỏ Bảy Màu',
                path: './assets/music/motngaychangnang.mp3',
                image: './assets/picture/mncn_PhaoftTho.jpg'
            },
            {
                name: 'Túy Âm',
                singer: 'Ngọc Mai',
                path: './assets/music/tuyam.mp3',
                image: './assets/picture/ta_NgocMai.jpg'
            },
            {
                name: 'Xóm Lom Com',
                singer: 'Trúc Nhân',
                path: './assets/music/xomlomcom.mp3',
                image: './assets/picture/xlc_TrucNhan.jpg'
            },
            {
                name: 'Xóm Trọ 3D',
                singer: 'Bạch Công Khanh',
                path: './assets/music/xomtro3D.mp3',
                image: './assets/picture/x3D_BachCongKhanh.png'
            }
        ],
        // xử lý đưa các song lên giao diện
        render: function() {
            const htmls = this.songs.map((song, index) => {
                return `<div class="song item-song-${index}" data-index="${index}">
                            <div class="thumb" style="background-image: url(${song.image});"></div>
                            <div class="song-body">
                                <h3 class="song-title">${song.name}</h3>
                                <p class="song-singer">${song.singer}</p>
                            </div>
                            <div class="song-option">
                                <i class="option-icon fas fa-ellipsis-h"></i>
                            </div>
                        </div>`
            })

            playlist.innerHTML = htmls.join('')
            $('.song').classList.add('active')
        },
        // Hàm định nghĩa ra các thuộc tính
        defineProperties: function() {
            Object.defineProperty(this, 'currentSong', {
                get: function() {
                     return this.songs[this.currentIndex]
                },
                
            })
            Object.defineProperty(this, 'songHTML', {
                get: function() {
                    return $('.song.item-song-' + this.currentIndex)
                }
            })
        },
        // hàm xử lý các sự kiện tương tác do người dùng
        handleEvents: function() {
            // xử lý Cd quay/ dừng
            const cdThumbAnimation = imageCD.animate([
                {transform: 'rotate(360deg)'}
            ], {
                duration: 10000, //10 giay
                iterations: Infinity,
                easing: 'linear'
            })
            cdThumbAnimation.pause()
            // xử lý zoom in/out cd
            const cdWidth = cd.offsetWidth
            document.onscroll = function() {
                const scroll = window.scrollY || document.documentElement.scrollTop
                const newWidth = cdWidth - scroll

                cd.style.width = newWidth > 0 ? newWidth + 'px' : 0
                cd.style.opacity = newWidth / cdWidth
            }

            // xử lý click play button
            btnPlay.onclick = function() {
                if(!app.isPlaying) {
                    audioSong.play()
                } else {
                    audioSong.pause()
                }
                
            }

            // xử lí click next button
            btnNext.onclick = function() {
                if(app.isRandom) {
                    app.randomSong()
                } else {
                    app.nextSong()
                }
                audioSong.play()
                app.scrollToActiveSong()
            }

            // xử lí click previous button
            btnPrev.onclick = function() {
                if(app.isRandom) {
                    app.randomSong()
                } else {
                    app.prevSong()
                }
                audioSong.play()
                app.scrollToActiveSong()
            }

            // xử lí khi click random button
            btnRandom.onclick = function(e) {
                app.isRandom = !app.isRandom
                btnRandom.classList.toggle('active')
            }

            // xử lí khi click repeat button
            btnRepeat.onclick = function() {
                app.isRepeat = !app.isRepeat
                btnRepeat.classList.toggle('active')
            }

            // khi bài hát được phát
            audioSong.onplay = function() {
                app.isPlaying = true
                btnPlay.classList.add('playing')
                cdThumbAnimation.play()
            }

             // khi song bị tạm dừng
             audioSong.onpause = function() {
                app.isPlaying = false
                btnPlay.classList.remove('playing')
                cdThumbAnimation.pause()
            }

            // khi phát xong bài hát
            audioSong.onended = function() {
                if(app.isRepeat) {
                    audioSong.play()
                } else {
                    btnNext.click()
                }
            }

            // xử lí hành vi click vào playlist
            playlist.onclick = function(e) {
                const songNode = e.target.closest('.song:not(.active)')
                if (songNode) {
                    if (!e.target.closest('.song-option')) {
                        app.songHTML.classList.remove('active')
                        app.currentIndex = songNode.dataset.index
                        app.loadCurrentSong()
                        app.songHTML.classList.add('active')
                        audioSong.play()
                    } else {
                        //xử lí khi click vào option
                    }
                }
            }

            // khi tiến độ bài hát thay đổi
            audioSong.ontimeupdate = function() {
                // do giấ trị mặc định của duration khi chưa phát nhạc là NaN 
                //nên phải kiểm tra nếu khác giá trị này thì mới thực hiện sự kiện
                if(audioSong.duration) {
                    const progressPercent = Math.floor(audioSong.currentTime / audioSong.duration * 100)
                    progressBar.value = progressPercent
                }
                
            }

            // xử lí tua bài hát
            progressBar.oninput = function(e) {
                const seekTimes = e.target.value * audioSong.duration / 100
                audioSong.currentTime = seekTimes
            }
        },
        // Tải bài hát 
        loadCurrentSong: function() {
            nameSong.innerHTML = this.currentSong.name
            imageCD.style.backgroundImage = `url(${this.currentSong.image})`
            audioSong.src = this.currentSong.path
        },
        // Scroll đến bài hát active
        scrollToActiveSong: function() {
            setTimeout(() => {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'end'
                })
            },300)
        },
        // chuyển sang bài nhạc tiếp theo
        nextSong: function() {
            this.songHTML.classList.remove('active')
            this.currentIndex++
            if(this.currentIndex >= this.songs.length) {
                this.currentIndex = 0
            }
            this.songHTML.classList.add('active')
            this.loadCurrentSong()
        },
        // trở về bài hát trước đó
        prevSong: function() {
            this.songHTML.classList.remove('active')
            this.currentIndex--
            if(this.currentIndex < 0 ) {
                this.currentIndex = this.songs.length - 1
            }
            this.songHTML.classList.add('active')
            this.loadCurrentSong()
        },
        // trả về một bài hát bất kì
        randomSong: function() {
            let randomIndex
            do {
                randomIndex = Math.floor(Math.random() * this.songs.length)
            } while(randomIndex === this.currentIndex)
            this.songHTML.classList.remove('active')
            this.currentIndex = randomIndex
            this.songHTML.classList.add('active')
            this.loadCurrentSong()
        },
        // bắt đầu chạy các hàm xử lý
        start: function() {
            this.defineProperties()
            this.render()
            this.handleEvents()
            this.loadCurrentSong()
        }
}

app.start()