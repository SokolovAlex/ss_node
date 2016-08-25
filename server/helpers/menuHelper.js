var addAuth = (menu, user) => {

    if(!user) {
        return menu.concat([{
            title: 'Войти',
            modal: true,
            link: '#loginModal'
        }]);
    }
    return menu.concat([{
        title: `${user.fname} ${user.lname}`,
        icon: 'user',
        submenu: [{
            title: 'Профиль',
            link: '/profile'
        }, {
            title: 'Фотографии',
            link: '/photos'
        }, {
            title: 'результаты игр',
            link: '/game_results'
        }, {
            separator: true
        }, {
            title: 'Выйти',
            link: '/auth/logout'
        }]
    }]);
};

const welcome = (user) => {
    var menu = [{
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
    }];

    menu = addAuth(menu, user);

    return menu;
};

const back = (user, current) => {
    var menu = [{
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
    }];

    menu = addAuth(menu, user);

    return menu;
};

module.exports = {
    welcome: welcome,
    back: back
};