/**
 * Created by alexs_000 on 26.03.2016.
 */
import _ from 'lodash';
import {createCards} from "../utils/couplesUtils";

const couples = (state = {cards: [], theme: "tourism", questionCard: null, answerCard: null, score: 0}, action) => {
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
                    state.questionCard.opened = false;
                    state.answerCard.opened = false;
                } else {
                    state.score += 2;
                    if (state.score === state.size) {
                        alert("WIN!");
                    }
                }
                state.questionCard = null;
                state.answerCard = null;
            }
            return state;
        case 'start_game':
            state.theme = "tourism";
            state.cards = createCards(4, 5, state.theme);
            state.size = 3 * 4;
            return state;
        default:
            return state;
    }
};

export default couples;