
let months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

class Cal_Square extends HTMLElement {

    static observedAttributes = ["value"];

    constructor() {
        super();

    }

    attributeChangedCallback(name, oldVal, newVal) {

        this.style.width = `${100 / 7}%`
        this.style.height = "100%";

        this.innerHTML = `<div style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center">${newVal}</div>`;
        
    }
}

class Cal_Bar extends HTMLElement {

    static observedAttributes = ["squares"];

    constructor() {
        super();
    }

    set squares(val) {
        this.setAttribute('squares', val);
    }

    attributeChangedCallback(name, oldVal, newVal) {

        this.style.width = "100%";

        let data = JSON.parse(newVal);

        let htmlStr = "<div style='width: 100%; height: 50px; display: flex; justify-content: center; align-items: center'>";



        for (let i in data) {


            htmlStr += `<cal-square value='${data[i]}'></cal-square>`

        }

        htmlStr += "</div>";

        this.innerHTML = htmlStr;
        
    }
}

let control = null;

class Dir_Button extends HTMLElement { 

    action = {
        left: (e) => {
            control(-1);
        },
        right: (e) => {
            control(1);
        }
    };

    static observedAttributes = ["action", "label"];

    constructor() {
        super();

        //this.shadow = this.attachShadow({ mode: 'open' });
    }

    set Action(val) {
        this.setAttribute("action", val);
    }

    set Label(val) {
        this.setAttribute("label", val);
    }

    attributeChangedCallback(name, oldVal, newVal) {

        this.style.height = "100%";
        this.style.width = "15%";
        this.zIndex = 99999;

        switch (name) {
            case "action":
                this.onclick = this.action[newVal];

                break;

            case "label":

                let div = document.createElement("div");
                

                div.style.width = "100%";
                div.style.height = "100%";
                div.style.display = "flex";
                div.style.justifyContent = "center";
                div.style.alignItems = "center";
                div.style.fontSize = "300%";
                div.style.zIndex = 9999;
                div.className = "dir-button";
                div.textContent = newVal;


                this.innerHTML = div.outerHTML;
                break;
        }

    }
}

class Cal_Header extends HTMLElement {

    static observedAttributes = ["month", "year"];

    constructor() {
        super();


        this.left_dir_button = document.createElement('dir-button');

        this.left_dir_button.Action = "left";

        this.left_dir_button.Label = "<";



        this.right_dir_button = document.createElement('dir-button');

        this.right_dir_button.Action = "right";

        this.right_dir_button.Label = ">";

    }

    set NewMonth(val) {
        this.setAttribute('month', val);
    }

    set NewYear(val) {
        this.setAttribute('year', val);
    }

    connectedCallback() {

    }

    attributeChangedCallback(name, oldVal, newVal) {

        switch (name) {
            case "month":
                this.month = parseInt(newVal);
                break;
            case "year":

                this.year = parseInt(newVal);

                break;
        }

        this.style.height = "75px";
        this.style.width = "100%";

        let htmlStr = `
        <div style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; z-index: 99999">

            ${this.left_dir_button.outerHTML}

            <div style="width: 70%; height: 100%; display: block;">

                <div style="width: 100%; height: 75%; display: flex; justify-content: center; align-items: center">${this.year}</div>

                <div style="width: 100%; height: 25%; display: flex; justify-content: center; align-items: center">${months[this.month]}</div>

            </div>

            ${this.right_dir_button.outerHTML}

        </div>`

        this.innerHTML = htmlStr;

    }
}


let InsertDates = (start_day, end_date) => {

    let days_arr = [];

    let week_arr = [];

    for (let i = 0; i < start_day; i++) {

        week_arr.push("");

    }

    let day = 1;

    for (let i = start_day; i < (end_date + start_day); i++) {

        if (i % 7 === 0) {

            days_arr.push(week_arr);

            week_arr = [];
        }

        week_arr.push(day);

        day++;
    }

    for (let i = end_date + start_day; i % 7 != 0; i++) {

        week_arr.push("");

    }

    days_arr.push(week_arr);

    return days_arr;
};

class Cal_Body extends HTMLElement {

    static observedAttributes = ["year", "month", "dates"];

    constructor() {
        super();

        this.ch = document.createElement('cal-header');

        control = this.AnotherMonth;

    }

    set NewYear(value) {
        this.setAttribute("year", value);
    }

    set NewMonth(value) {
        this.setAttribute("month", value);
    }

    set NewDates(value) {
        this.setAttribute("dates", value);
    }

    Weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    year = new Date().getFullYear();
    month = new Date().getMonth();
    dates = [];

    AnotherMonth = (dir) => {

        this.month = (parseInt(this.month) + dir) % 12;

        this.month = this.month < 0 ? parseInt(this.month) + 12 : this.month;

        this.NewMonth = this.month;

        if (dir > 0 && this.month === 0) {
            this.year = parseInt(this.year) + 1;
        }

        if (dir < 0 && this.month === 11) {
            this.year = parseInt(this.year) - 1;
        }

        this.NewYear = this.year;


        let end_date = new Date(this.year, this.month, 0).getDate();

        let start_day = new Date(`${months[this.month]} 01, ${this.year}`).getDay();

        let days_arr = InsertDates(start_day, end_date);

        this.NewDates = JSON.stringify(days_arr);

    }

    attributeChangedCallback(name, oldVal, newVal) {

        switch (name) {
            case "year":
                this.year = parseInt(newVal);
                break;
            case "month":
                this.month = parseInt(newVal);
                break;
            case "dates":
                this.dates = JSON.parse(newVal);
                break;
        }


        this.ch.NewYear = this.year;
        this.ch.NewMonth = this.month;

        this.cal_bars = [];

        for (let i in this.dates) {

            this.cal_bars.push(document.createElement('cal-bar'));

            this.cal_bars[i].squares = JSON.stringify(this.dates[i]);

            this.cal_bars[i].parent = this;

        }

        let htmlStr = "";
        
        for (let i in this.cal_bars) {

            htmlStr += this.cal_bars[i].innerHTML;

        }

        this.style.width = "100%";

        this.innerHTML = `
            <div style="width: 100%; z-index: 999999">

                ${this.ch.outerHTML}
                
                <div style="width: 100%; display: block">
                    
                    <cal-bar squares='${JSON.stringify(this.Weekdays)}'></cal-bar>

                    ${htmlStr}

                </div>

            </div>
        `;

    }
}


class Calender extends HTMLElement {

    static observedAttributes = ["init"];

    constructor() {
        super();
    }

    connectedCallback() {
        let cb = document.createElement('cal-body');

        cb.parent = this;

        let today = new Date();

        let year = today.getFullYear();

        let month = today.getMonth();

        let date = today.getDate();

        let start_day = new Date(`${months[month]} 01, ${year}`).getDay();

        let end_date = new Date(year, month, 0).getDate();

        let days_arr = InsertDates(start_day, end_date);

        cb.NewYear = year;
        cb.NewMonth = month;
        cb.NewDates = JSON.stringify(days_arr);

        this.innerHTML = `
            <div style="width: 400px; display: block; border: black solid 0.5px; z-index: 99999">

                ${cb.outerHTML}

            </div>
        `;
    }

    attributeChangedCallback(name, oldVal, newVal) {

    }

}

customElements.define('cal-square', Cal_Square);
customElements.define('cal-bar', Cal_Bar);
customElements.define('dir-button', Dir_Button);
customElements.define('cal-header', Cal_Header);
customElements.define('cal-body', Cal_Body);
customElements.define('my-calendar', Calender);

let mycalendar = document.createElement('my-calendar');

document.body.appendChild(mycalendar);
