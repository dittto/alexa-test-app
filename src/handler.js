'use strict';

const Alexa = require('alexa-sdk');
const SharedVars = require('serverless-shared-vars').get();

module.exports.alexaTest = function (event, context, callback)
{
    const alexa = Alexa.handler(event, context);

    alexa.registerHandlers(initialUseHandler);
    alexa.registerHandlers(colourHandler);
    alexa.registerHandlers(shapeHandler);

    alexa.dynamoDBTableName = SharedVars.dynamodb_table;

    alexa.execute();
};

const states = {
    COLOUR_STATE: 'state_colour',
    SHAPE_STATE: 'state_shape'
};

const colours = [
    'red',
    'green',
    'blue',
    'yellow',
    'white',
    'black'
];

const shapes = [
    'square',
    'circle',
    'triangle',
    'cross'
];

const initialUseHandler = {
    'LaunchRequest': function () {
        this.handler.state = states.COLOUR_STATE;
        this.emitWithState('LaunchRequest');
    }
};

const colourHandler = Alexa.CreateStateHandler(states.COLOUR_STATE, {
    'LaunchRequest': function () {
        let message = '';
        switch (this.event.request.locale) {
            case 'en-US':
                message = 'Yo. What up? This is, like, a simple test app. What\'s yer favourite colour? If yer wanna quit then screw you and just say stop.';
                break;
            case 'de-DE':
                message = 'Schönen Tag. Dies ist eine einfache Testanwendung. Um zu beginnen, sagen Sie mir Ihre Lieblingsfarbe. Wenn Sie jederzeit aufhören wollen, sagen Sie einfach "Stop".';
                break;
            default:
                message = 'Good day to you. This is a simple test application. To start, tell me your favourite colour. If you want to quit at any time, just say stop.';
        }

        this.handler.state = states.COLOUR_STATE;
        this.attributes = {};
        this.emit(':saveState', true);

        this.response.speak(message).listen(message);
        this.emit(':responseReady');
    },

    'ColourIntent': function () {
        const slots = this.event.request.intent && this.event.request.intent.slots ? this.event.request.intent.slots : {};
        const colour = slots.colour ? slots.colour.value.toLowerCase() : '';

        if (colours.indexOf(colour) === -1) {

            this.response.speak('I don\'t know that colour. Try again with another');
            this.response.listen('Are you still there? Try another colour');

            this.emit(':responseReady');

            return;
        }

        this.handler.state = states.SHAPE_STATE;
        this.attributes['colour'] = colour;
        this.emit(':saveState', true);

        this.response.speak('Great. What is your favourite shape?');
        this.response.listen('I said, what is your favourite shape?');

        this.emit(':responseReady');
    },

    'AMAZON.StopIntent': function () {
        this.response.speak('Ok, good bye');
        this.emit(':responseReady');
    },

    'Unhandled': function () {
        this.response.speak('I didn\'t quite get that. What is your favourite colour?');
        this.response.listen('Do you have a favourite colour?');

        this.emit(':responseReady');
    }
});

const shapeHandler = Alexa.CreateStateHandler(states.SHAPE_STATE, {
    'LaunchRequest': function () {
        const colour = this.attributes['colour'];

        this.response.speak('Welcome back. Your favourite colour was ' + colour + '. Would you like to continue from here?');
        this.response.listen('Would you like to continue, yes or no?');

        this.emit(':responseReady');
    },

    'ContinueIntent': function () {
        const slots = this.event.request.intent && this.event.request.intent.slots ? this.event.request.intent.slots : {};
        const option = slots.continue_option ? slots.continue_option.value.toLowerCase() : 'no';

        if (option === 'no') {
            this.handler.state = states.COLOUR_STATE;
            this.emitWithState('LaunchRequest');

            return;
        }

        this.response.speak('What is your favourite shape?');
        this.response.listen('What is your favourite shape?');

        this.emit(':responseReady');
    },

    'ShapeIntent': function () {
        const slots = this.event.request.intent && this.event.request.intent.slots ? this.event.request.intent.slots : {};
        const shape = slots.shape ? slots.shape.value.toLowerCase() : '';

        if (shapes.indexOf(shape) === -1) {

            this.response.speak('I don\'t know that shape. Try again with another one');
            this.response.listen('Are you still there? Try another shape');

            this.emit(':responseReady');

            return;
        }

        const colour = this.attributes['colour'];

        this.response.speak('So your favourite is a ' + colour + " " + shape + ". Great. Thanks! Bye!");

        this.handler.state = states.COLOUR_STATE;
        this.attributes = {};
        this.emit(':saveState', true);

        this.emit(':responseReady');
    },

    'AMAZON.StopIntent': function () {
        this.response.speak('Ok, good bye');
        this.emit(':responseReady');
    },

    'Unhandled': function () {
        this.response.speak('I didn\'t quite get that. What is your favourite shape?');
        this.response.listen('Do you have a favourite shape?');

        this.emit(':responseReady');
    }
});