var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);
/**
 * 1 rander and current song
 * 2 play music and stop music
 * 3 auto play
 * 4 zoom face and face turn
 * 5 up and down range
 * 6 repeat and shuffle
 * 7 choose music and hightlight
 */

const list = $('.list')
const headerName = $('.header_name>h2')
const faceImg = $('.face_img')
const face = $('.face')
const audio = $('.music')
const bar = $('.bar')
const pause = $('.pause')
const forward = $('.forward')
const backward = $('.backward')
const repeat = $('.repeat')
const shuffle = $('.shuffle')
const minus = $('#minus')
const add = $('#add')

var app = {
    randomIndex: [],
    play: false,
    config: JSON.parse(localStorage.getItem('config')) || {},
    setConfig(key, value) {
        this.config[key] = value;
        localStorage.setItem("config", JSON.stringify(this.config));
    },
    songs: [
        {
            name: 'Có Chơi Có Chịu',
            singer: 'Karik & Only C',
            link: './acces/music/music1.mp3',
            img: './acces/img/img1.jpg'
        },
        {
            name: 'Bên Anh Đêm Nay',
            singer: 'JC Hưng & Binz',
            link: './acces/music/music2.mp3',
            img: './acces/img/img2.jpg'
        },
        {
            name: 'Im Lặng',
            singer: 'Lil Knight & P.A',
            link: './acces/music/music3.mp3',
            img: './acces/img/img3.jpg'
        },
        {
            name: 'Buông Bàn Tay Thật Nhanh',
            singer: 'Đạt G & Du Uyên',
            link: './acces/music/music4.mp3',
            img: './acces/img/img4.jpg'
        },
        {
            name: 'Có Không Giữ Mất Đừng Tìm',
            singer: 'Cảnh Minh',
            link: './acces/music/music5.mp3',
            img: './acces/img/img5.jpg'
        },
        {
            name: 'Chúng Ta Không Thuộc Về Nhau',
            singer: 'Sơn Tùng MTP',
            link: './acces/music/music6.mp3',
            img: './acces/img/img6.jpg'
        },
        {
            name: 'Ế',
            singer: 'Karik & Windy Quyên',
            link: './acces/music/music7.mp3',
            img: './acces/img/img7.jpg'
        },
        {
            name: 'Thuận Theo Ý Trời',
            singer: 'Bùi Anh Tuấn',
            link: './acces/music/music8.mp3',
            img: './acces/img/img8.jpg'
        },
        {
            name: 'Lỡ Thương Một Người',
            singer: 'Nguyễn Đình Vũ',
            link: './acces/music/music9.mp3',
            img: './acces/img/img9.jpg'
        },
        {
            name: 'Thế Thái',
            singer: 'Hương Ly',
            link: './acces/music/music10.mp3',
            img: './acces/img/img10.jpg'
        },
    ],
    reate() {
        Object.defineProperty(this, 'currentSong', {
            get() {
                return this.songs[this.currentIndex];
            }
        });
    },
    loadConfig() {
        audio.volume = this.config.volume || 0.5;
        this.currentIndex = this.config.currentIndex || 0;
        this.randomIndex.push(this.currentIndex);
        this.repeat = this.config.repeat || false;
        this.shuffle = this.config.shuffle || false;
        repeat.classList.toggle('active', this.repeat)
        shuffle.classList.toggle('active', this.shuffle)
    },
    render() {
        let result = this.songs.map((song, index) => {
            return `<li class="item ${index === this.currentIndex ? 'active' : ''}"
            data-index="${index}">
            <div class="item_img">
              <div class="face_img" style="background-image: url(${song.img});"></div>
            </div>
            <div>
              <h2 class="item_song">${song.name}</h2>
              <p class="item_singer">${song.singer}</p>
            </div>
            <div class="item_btn">
              <i class="fa-solid fa-ellipsis"></i>
            </div>
          </li>`
        }).join('');
        list.innerHTML = result;
    },
    activeSong() {
        $('.item.active').classList.remove('active');
        const item = $(`[data-index*="${this.currentIndex}"]`);
        item.classList.add('active');
        setTimeout(()=>{
            item.scrollIntoView({behavior: 'smooth', block: `${this.currentIndex === 0 ? 'end' : 'nearest'}`})
        },300)
    },
    renderCurrentSong() {
        let current = this.currentSong;
        headerName.innerHTML = current.name;
        faceImg.style.backgroundImage = `url(${current.img})`;
        audio.src = current.link;
        this.activeSong()
        this.setConfig('currentIndex', this.currentIndex);
    },
    random() {
        let random;
        do{
            random = Math.floor(Math.random() * this.songs.length)
        }while(this.randomIndex.includes(random))

        if(this.randomIndex.length === this.songs.length - 1) {
            this.randomIndex = []
            this.randomIndex.push(random);
        } else {
            this.randomIndex.push(random); 
        }

        return random
    },
    listenEvent() {
        const _this = this;
        pause.onclick = function() {
            if(_this.play){
                audio.pause();
            }else{
                audio.play();
            }
        }
        repeat.onclick = function() {
            _this.repeat = !_this.repeat
            this.classList.toggle('active', _this.repeat)
            if(_this.repeat && _this.shuffle){
                shuffle.classList.remove('active')
                _this.shuffle = false
                _this.setConfig('shuffle', _this.shuffle);
            }
            _this.setConfig('repeat', _this.repeat);
        }
        shuffle.onclick = function() {
            _this.shuffle = !_this.shuffle
            this.classList.toggle('active', _this.shuffle)
            if(_this.shuffle && _this.repeat){
                repeat.classList.remove('active')
                _this.repeat = false
                _this.setConfig('repeat', _this.repeat);
            }
            _this.setConfig('shuffle', _this.shuffle);
        }
        audio.onpause = function() {
            pause.classList.remove('active');
            _this.play = false;
            animation.pause();
        }
        audio.onplay = function() {
            pause.classList.add('active');
            _this.play = true;
            animation.play();

        }
        let animation = faceImg.animate([
                { transform: 'rotate(360deg)' }
            ],
            {
            duration: 10000,
            iterations: Infinity,
        })
        animation.pause();
        document.onscroll = function(e) {
            let heightFace = this.documentElement.scrollTop.toFixed()
            if(heightFace <= 400) {
                face.style.width = (100 - heightFace / 4) + '%';
                face.style.opacity = 1 - heightFace / 300;
            }
        }
        bar.onchange = function() {
            let currentTime = this.value / 100 * audio.duration;
            audio.currentTime = currentTime;
        }
        audio.ontimeupdate = function(){
            let percentTime = this.currentTime * 100 / this.duration;
            bar.value = this.currentTime == 0 ? 0 : percentTime.toFixed();
        }
        audio.onended = function(){
            if(_this.repeat){
                audio.play()
            }else {
                forward.click()
            }
        }
        forward.onclick = function() {
            if(_this.shuffle){
                _this.currentIndex = _this.random();
            }else {
                _this.currentIndex ++;
            }
            if(_this.currentIndex === _this.songs.length) {
                _this.currentIndex = 0;
            }
            _this.renderCurrentSong();
            audio.play();
        }
        backward.onclick = function() {
            if(_this.shuffle){
                _this.currentIndex = _this.random();
            }else {
                _this.currentIndex --;
            }
            if(_this.currentIndex < 0) {
                _this.currentIndex = _this.songs.length - 1;
            }
            _this.renderCurrentSong();
            audio.play();
        }
        list.onclick = function(e) {
            const song = e.target.closest('.item:not(.active)');
            if(song || e.target.closest('.item_btn')) {
                if(song && !e.target.closest('.item_btn')) {
                    _this.currentIndex = Number(song.dataset.index);
                    _this.renderCurrentSong();
                    audio.play();
                }
                if(e.target.closest('.item_btn')) {

                }
            }
        }
        minus.onclick = function() {
            if(audio.volume > 0.11){
                audio.volume -= 0.1;
            } else {
                audio.volume = 0;
            }
            _this.setConfig('volume', audio.volume)
            console.log(audio.volume)
        }
        add.onclick = function() {
            if(audio.volume < 0.9){
                audio.volume += 0.1;
            } else {
                audio.volume = 1;
            }
            _this.setConfig('volume', audio.volume)
            console.log(audio.volume)
        }
    },
    start() {
        this.reate()
        this.loadConfig();
        this.render();
        this.renderCurrentSong();
        this.listenEvent()
    }
}
app.start();