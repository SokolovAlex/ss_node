/**
 * Created by alexs_000 on 21.03.2016.
 */
import React, { Component } from 'react';
import { openCard, checkAnswer } from './actions';

let lock = false;

export default class CouplesCard extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let card = this.props.card;
        let theme = this.props.theme;
        this.store = this.props.store;

        const imagePath = (name) => {
            //return `/build/images/${theme}/${name}.jpg`;
            return `/games/couples/images/${theme}/${name}.jpg`;
        };

        const cardClick = this.onClick.bind(this, card);

        const cardBackStyle = {
            backgroundImage: `url(${imagePath('back')})`
        };

        const cardFrontStyle = {
            backgroundImage: `url(${imagePath(card.key)})`
        };

        let className = `card ${card.opened ? 'opened' : ''}`;

        return (
            <div className="flipper" onClick={cardClick}>
                <div className={className} key={card.key}>
                      <figure  className='back' style={cardBackStyle}></figure >
                      <figure  className='forward'  style={cardFrontStyle}></figure >
                </div>
            </div>
        );
    }
    onClick(card) {
        if (lock) {
            return;
        }

        this.store.dispatch(openCard(card));

        let self = this;
        let state = this.store.getState().couples;

        if (state.questionCard && state.answerCard) {
            lock = true;
            setTimeout(()=> {
                self.store.dispatch(checkAnswer());
                lock = false;
            }, 1000);
        }
    }
}

export default class CouplesGame extends Component {
    render() {
        let store = this.props.store;
        let state = store.getState();

        let cardRows = state.couples.cards;
        let theme = state.couples.theme;
        let className = `couples ${theme}`;

        return (
            <div className="inner cover">
                <div className={className}>
                    {
                        cardRows.map((row, i)=>
                            <div className="row" key={i}> {
                                    row.map(card =>
                                        <CouplesCard key={card.r + '_' + card.c}
                                            card={card}
                                            theme={theme}
                                            store={store}
                                        />
                                    )
                                }
                            </div>
                    )}
                </div>
            </div>
        );
    }
}
