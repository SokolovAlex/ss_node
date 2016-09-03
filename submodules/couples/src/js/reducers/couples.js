/**
 * Created by alexs_000 on 26.03.2016.
 */
import _ from 'lodash';
import {createCards} from "../utils/couplesUtils";

const couples = (state = {cards: [], theme: "tourism", questionCard: null, answerCard: null, score: 0, fails: 0, startTime: null}, action) => {
    switch (action.type) {
        case 'open_card':
            let card = action.card;
            if (card.opened){
                return state;
            }

            let stateCard = state.cards[card.r] && state.cards[card.r][card.c];
            if (stateCard) {
                stateCard.opened = !stateCard.opened;
            }

            if (!state.questionCard) {
                state.questionCard = stateCard;
            } else {
                state.answerCard = stateCard;
            }
            return state;
        case 'check_answer':
            if (state.questionCard && state.answerCard) {
                if (state.questionCard.key !== state.answerCard.key) {
                    state.fails++;
                    state.questionCard.opened = false;
                    state.answerCard.opened = false;
                } else {
                    state.score += 2;
                    if (state.score === state.size) {
                        let endGameDate = new Date();
                        var gameDuration = endGameDate - state.startTime;
                        console.log('end', gameDuration);
                        var event = new CustomEvent("endGame", { 'detail': { gameDuration, fails: state.fails } });
                        document.dispatchEvent(event);
                        //document.addEventListener("endGame", function(e) { process(e.detail) });
                    }
                }
                state.questionCard = null;
                state.answerCard = null;
            }
            return state;
        case 'start_game':
            state.cards.forEach(row => row.forEach(card => card.opened = false));
            state.startTime = new Date();
            return state;
        case 'create_cards':
            let rows = 4, cols = 5;
            state.cards = createCards(rows, cols, state.theme);
            state.size = rows * cols;
            return state;
        default:
            return state;
    }
};

export default couples;