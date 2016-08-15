const welcome = () => {
    return [{
        title: 'Туры',
        link: '#hot',
        scroll: true
    }, {
        title: 'О нас',
        link: '#about',
        scroll: true
    }, {
        title: 'Команда',
        link: '#team',
        scroll: true
    }, {
        title: 'Заявка',
        link: '#contact',
        scroll: true
    }, {
        title: 'Прочее',
        submenu: [{
            title: 'Поиск авиабилетов',
            link: '/aviakassa'
        }, {
            separator: true
        }, {
            title: 'Туристические игры',
            link: '/games'
        }]
    }, {
        title: 'Войти',
        modal: true,
        link: '#loginModal'
    }];
};

const back = (current) => {
    return [{
        title: 'Назад',
        link: '/'
    }, {
        title: 'Прочее',
        submenu: [{
            title: 'Поиск авиабилетов',
            link: '/aviakassa'
        }, {
            separator: true
        }, {
            title: 'Туристические игры',
            link: '/games'
        }]
    }, {
        title: 'Войти',
        modal: true,
        link: '#loginModal'
    }];
};

module.exports = {
    welcome: welcome,
    back: back
};