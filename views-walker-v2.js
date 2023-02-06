class ViewsWalker extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    setConfig(config) {
        if (!config.entity) {
            throw new Error('Please define an entity');
        }

        const root = this.shadowRoot;
        if (root.lastChild)
            root.removeChild(root.lastChild);

        const cardConfig = Object.assign({}, config);

        const entityParts = this._splitEntityAndAttribute(cardConfig.entity);
        cardConfig.entity = entityParts.entity;
        if (entityParts.attribute)
            cardConfig.attribute = entityParts.attribute;

        const content = document.createElement('div');
        content.innerHTML = this._html();

        const style = document.createElement('style');
        style.textContent = this._css();

        const card = document.createElement('ha-card');
        card.appendChild(content);
        card.appendChild(style);
        card.addEventListener('click', event => {
            this._fire('hass-more-info', {entityId: cardConfig.entity});
        });
        root.appendChild(card);
        this._config = cardConfig;
    }

    _splitEntityAndAttribute(entity) {
        let parts = entity.split('.');
        if (parts.length < 3) {
            return {entity: entity};
        }

        return {attribute: parts.pop(), entity: parts.join('.')};
    }

    _fire(type, detail, options) {
        const node = this.shadowRoot;
        options = options || {};
        detail = (detail === null || detail === undefined) ? {} : detail;
        const event = new Event(type, {
            bubbles: options.bubbles === undefined ? true : options.bubbles,
            cancelable: Boolean(options.cancelable),
            composed: options.composed === undefined ? true : options.composed
        });
        event.detail = detail;
        node.dispatchEvent(event);
        return event;
    }

    _translateTurn(value, config) {
        return 5 * (value - config.min) / (config.max - config.min)
    }

    _getEntityStateValue(entity, attribute) {
        if (!attribute) {
            return entity.state;
        }

        return entity.attributes[attribute];
    }

    set hass(hass) {
        const root = this.shadowRoot;
        const config = this._config;
        const entityState = this._getEntityStateValue(hass.states[config.entity], config.attribute);

        if (entityState !== this._entityState) {
            this.setCard(root, hass, config, entityState);
        }
    }

    getControl() {

    }

    setCard(root, hass, config, entityState) {
        var nextpage = config.nextpage;
        var timeinterval = config.timeinterval;
        setTimeout(() => this._loadview(nextpage), timeinterval);
        setInterval(this._updateClock, 1000);
        
        var currentdate = new Date(); 
        var time = currentdate.getHours() + ":" + currentdate.getMinutes() ;
        root.getElementById("clock").innerHTML = time;

        root.getElementById("title").innerHTML = "&nbsp;&nbsp;Next page: " + nextpage;

        root.lastChild.hass = hass;
    }

    getCardSize() {
        return this.config.entities.length + 1;
    }
    
    _updateClock() {
      var currentdate = new Date(); 
      var time = currentdate.getHours() + ":" + currentdate.getMinutes() + "&nbsp;&nbsp;";
      root.getElementById("clock").innerHTML = time;
    }
    
    _loadview(page) {
      window.location.href = page;
    }

    _css() {
        return `
            :host {
                background-color: transparent !important;
            }
            
            ha-card.type-custom-rs-gauge-card {
                box-shadow: none !important;
                background-color: transparent !important;
            }
            
            .container {
              vertical-align: top;
            }
            .title {
              float: left;
            }
            .clock {
              float: right;
              font-size: 60px;
              font-weight: bold;
              margin-top: 15px; !important;
            }
        `;
    }

    _html() {
        return `
            <div class="container" id="container">
              <div class="title" id="title">
              </div>
              <div class="clock" id="clock">
              </div>
            </div>
        `;
    }
}


customElements.define('views-walker', ViewsWalker); 
