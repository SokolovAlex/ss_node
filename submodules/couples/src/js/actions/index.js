/**
 * Created by alexs_000 on 26.03.2016.
 */

export const startGame = () => {
    return {
        type: 'start_game'
    };
};

export const endGame = () => {
    return {
        type: 'end_game'
    };
};

export const openCard = (card) => {
    return {
        type: 'open_card',
        card
    };
};

export const createCards = (theme) => {
    return {
        type: 'create_cards',
        theme
    };
};

export const hideAll = () => {
    return {
        type: 'hide_all'
    };
};

export const checkAnswer = () => {
    return {
        type: 'check_answer'
    };
};

