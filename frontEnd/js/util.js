
const buildAnimation = (animName, spriteSrc, frameRate, repeat, scene) => {

    scene.anims.create({
        key: `${animName}`,
        frames: scene.anims.generateFrameNumbers(`${spriteSrc}`),
        frameRate: frameRate,
        repeat: repeat // -1 is a endless loop

    });
};

const gen = (xDiv, yDiv, scene) => {

    let x = 0;
    let y = 0;
    let xInc = scene.map.width / xDiv
    let yInc = scene.map.height /yDiv;

    while (y <= scene.map.height - 400 ) {

        while(x <= scene.map.width ) {

            let xCord = Math.floor(Math.random() * (xInc * 0.75 + (xInc * 0.25))) + x;
            let yCord = Math.floor(Math.random() * (yInc * 0.75 + (yInc * 0.25)))  + y;

            if (yCord < 5700) {
                
                let p = scene.platforms.create(xCord, yCord, 'platform').body.setAllowGravity(false).setImmovable(true);
                let it = scene.barriers.create(xCord, yCord -300, 'top').body.setAllowGravity(false).setImmovable(true);
                let is1 = scene.barriers.create(xCord - 160 , yCord - 130, 'side').body.setAllowGravity(false).setImmovable(true);
                let is2 = scene.barriers.create(xCord + 160 , yCord - 130, 'side').body.setAllowGravity(false).setImmovable(true);
                enemies.spawn(xCord, yCord);

            };
            x += xInc;
        };

        x = 0;
        y += yInc;
    };
};

const loadBar = (scene) => {

    let progressBar = scene.add.graphics();
    let progressBox = scene.add.graphics();

    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    let width = scene.cameras.main.width;
    let height = scene.cameras.main.height;

    let loadingText = scene.make.text({
        x: width / 2,
        y: height / 2 - 50,
        text: 'Loading...',
        style: {
            font: '20px monospace',
            fill: '#ffffff'
        }
    });

    loadingText.setOrigin(0.5, 0.5);

    let percentText = scene.make.text({
        x: width / 2,
        y: height / 2 - 5,
        text: '0%',
        style: {
            font: '18px monospace',
            fill: '#ffffff'
        }
    });

    percentText.setOrigin(0.5, 0.5);

    let assetText = scene.make.text({
        x: width / 2,
        y: height / 2 + 50,
        text: '',
        style: {
            font: '18px monospace',
            fill: '#ffffff'
        }
    });

    assetText.setOrigin(0.5, 0.5);

    scene.load.on('progress', function (value) {
        percentText.setText(parseInt(value * 100) + '%');
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(250, 280, 300 * value, 30);
    });

    scene.load.on('fileprogress', function (file) {
        assetText.setText('Loading asset: ' + file.key);
    });

    scene.load.on('complete', function () {
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
        percentText.destroy();
        assetText.destroy();

    });
};

let mod = (sprite) => {

    sprite.antiGrav = false;
    sprite.razorMod = false;
    sprite.dropMod = false
    sprite.quickEscapeScroll = false;
    sprite.speeder = 1

    let playerInv = [];
    let nodeVentory = document.querySelectorAll('.inventory-items');

    nodeVentory.forEach(li => {

        if (parseInt(li.dataset.id) === 3) sprite.razorMod = true;

        if (parseInt(li.dataset.id) === 4) sprite.antiGrav = true;

        if (parseInt(li.dataset.id) === 5) sprite.quickEscapeScroll = true;

        if (parseInt(li.dataset.id) === 6) sprite.speeder = 2;
    });

    playerInv = playerInv.filter(el => {
        return el !== 'X';
    });
};

const areUBroke = (cost, cb) => {
    let test;
    fetch(`http://localhost:3000/users/${demon.currentUser.id}`)
    .then(r =>  r.json())
    .then( u => {
        let currentYens = u.data.attributes.yennies;

        if (cost >= parseInt(currentYens)) {
            test = u.data.attributes.yennies;
            return true

        } else {
            cb();
        }
    })
};

const purchase = (item_id) => {
    fetch('http://localhost:3000/inventories', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({item_id: item_id, user_id: demon.currentUser.id})
    })
    .then(r => r.json())
    .then(item => {});
};

let syncInv = (ul) => {

    fetch(`http://localhost:3000/users/${demon.currentUser.id}`)
    .then(r =>  r.json())
    .then( u => {
        let updatedInventory = u.data.attributes.items ;

        for (let li of ul.querySelectorAll('li')) {
            li.remove();
        };
  
        for (let nItem of updatedInventory) {
            let nLi = document.createElement('li');
            nLi.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center inventory-items');
            nLi.textContent = nItem.name;
            nLi.dataset.id = nItem.id;
            ul.appendChild(nLi);

            if (sceneManager.isShop === true) {
                let redBtn = document.createElement('span');
                redBtn.setAttribute('class', 'badge badge-danger badge-pill')
                redBtn.textContent = 'x';
                redBtn.id = 'delete-button'
                nLi.appendChild(redBtn);
            };
        };
    });
};

const domYenniesSync = (num) => {

    let domYennies = document.querySelector('#user-yennies');

    if (domYennies)  {

        let y = parseInt(domYennies.textContent.split(' ')[1]);
        domYennies.textContent = `Yennies: ${y - num}`;

    };
};

const consumeScroll = () => {

    fetch('http://localhost:3000/scroll', {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({user_id: demon.currentUser.id, item_id: 5})
    });
};

const pullTop5 = () => {

    fetch('http://localhost:3000/rankings')
    .then(r => r.json())
    .then(top5 => {

        let first = top5[0];
        let second = top5[1]
        let third = top5[2];
        let fourth = top5[3]
        let fith = top5[4];

        let rankingDiv = document.createElement('div');
        let rankingDiv2 = document.createElement('div');
        rankingDiv2.innerHTML += `<div class="list-group"> `;

        top5.forEach(u => {
            rankingDiv2.innerHTML += 
            `
                <a href="#" class="list-group-item list-group-item-action active">
                <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">${u.username}</h5>
                </div>
                <p class="mb-1">Yennies: ${u.yennies}</p>
                </a>
            `
        });

        rankingDiv2.innerHTML += `</div>`;

        let htmlBuilOut =
            `
                <div class="list-group">
                    <a href="#" class="list-group-item list-group-item-action active">
                        <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1">${first.username}</h5>
                        </div>
                        <p class="mb-1">Yennies: ${first.yennies}</p>
                    </a>
            
                    <a href="#" class="list-group-item list-group-item-action">
                        <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1">${second.username}</h5>
                        </div>
                        <p class="mb-1">Yennies: ${second.yennies}.</p>
                    </a>
                    <a href="#" class="list-group-item list-group-item-action">
                        <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1">${third.username}</h5>
                        </div>
                        <p class="mb-1">${third.yennies}</p>
                    </a>
                </div>
            `;

        rankingDiv.innerHTML = htmlBuilOut;

        let mainCon = document.querySelector('#main-container');
        let top5r = document.querySelector('#top5ranks');

        if (top5r.innerText) {

            top5r.innerHTML = '';
            mainCon.style.display = 'block';

        } else {

            top5r.append(rankingDiv2);
            mainCon.style.display = 'none';

        };
    });
};

const razorBuy = () => {

    purchase(3);
    domYenniesSync(3000);

    let check = document.querySelector('#dom-inv');

    if (check) {

        let nLi = document.createElement('li');
        nLi.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center inventory-items');
        nLi.textContent = 'Razor Blade Orb(MOD)';
        nLi.dataset.id = 102;
        check.appendChild(nLi);
        let redBtn = document.createElement('span');
        redBtn.setAttribute('class', 'badge badge-danger badge-pill')
        redBtn.textContent = 'x';
        redBtn.id = 'delete-button'
        nLi.appendChild(redBtn);

    };
};

const escapeScrollBuy = () => {

    purchase(5);
    domYenniesSync(300);

    let check = document.querySelector('#dom-inv');

    if (check) {
        let nLi = document.createElement('li');
        nLi.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center inventory-items');
        nLi.textContent = 'Escape Scroll';
        nLi.dataset.id = 104;
        check.appendChild(nLi);
        let redBtn = document.createElement('span');
        redBtn.setAttribute('class', 'badge badge-danger badge-pill')
        redBtn.textContent = 'x';
        redBtn.id = 'delete-button'
        nLi.appendChild(redBtn);
    };
};

const antiGravBuy = () => {

    purchase(4);
    domYenniesSync(2400);

    let check = document.querySelector('#dom-inv');

    if (check) {

        let nLi = document.createElement('li');
        nLi.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center inventory-items');
        nLi.textContent = 'Anti Gravity Orb(MOD)';
        nLi.dataset.id = 103;
        check.appendChild(nLi);
        let redBtn = document.createElement('span');
        redBtn.setAttribute('class', 'badge badge-danger badge-pill')
        redBtn.textContent = 'x';
        redBtn.id = 'delete-button'
        nLi.appendChild(redBtn);
  
    };
};

const speederBuy = () => {
    
    purchase(6);
    domYenniesSync(1400);

    let check = document.querySelector('#dom-inv');

    if (check) {
        
        let nLi = document.createElement('li');
        nLi.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center inventory-items');
        nLi.textContent = 'Speed Orb(MOD)';
        nLi.dataset.id = 105;
        check.appendChild(nLi);
        let redBtn = document.createElement('span');
        redBtn.setAttribute('class', 'badge badge-danger badge-pill')
        redBtn.textContent = 'x';
        redBtn.id = 'delete-button'
        nLi.appendChild(redBtn);

    };
};