class FilmCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const name = this.getAttribute('name');
    const imageUrl = this.getAttribute('image');
    const developments = JSON.parse(this.getAttribute('data'));
    const boxISO = this.getAttribute('box-iso');

    developments.sort((a, b) => parseInt(a.iso) - parseInt(b.iso));

    const hasAnyDetails = developments.some(dev =>
        (dev.dilution && dev.dilution !== '1+25') ||
        (dev.temp && dev.temp !== '20C') ||
        dev.notes
    );

    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', 'style.css');

    const wrapper = document.createElement('div');

    const tableHeader = `
        <thead>
            <tr>
                <th>ISO</th>
                <th>Time</th>
                ${hasAnyDetails ? '<th>Details</th>' : ''}
            </tr>
        </thead>
    `;

    let tableRows = developments.map(dev => {
        const highlightClass = dev.iso === boxISO ? 'highlight' : '';
        const displayTime = String(dev.time).replace(/min/g, '').trim();

        let detailsParts = [];
        if (dev.dilution && dev.dilution !== '1+25') {
            detailsParts.push(`Dilution: ${dev.dilution}`);
        }
        if (dev.temp && dev.temp !== '20C' && dev.temp !== '68F') {
            detailsParts.push(`Temp: ${dev.temp}`);
        }
        const warnings = detailsParts.length > 0 ? `<span class="warning-text">${detailsParts.join('<br>')}</span>` : '';
        const notesButton = dev.notes ? `<button class="notes-button">Notes</button>` : '';
        const detailsCellContent = `${warnings} ${notesButton}`;

        const detailsCell = hasAnyDetails ? `<td class="details-cell">${detailsCellContent}</td>` : '';

        const notesRow = dev.notes ? `<tr class="notes-row"><td colspan="${hasAnyDetails ? 3 : 2}" class="notes-content">${dev.notes}</td></tr>` : '';

        return `
            <tr class="${highlightClass}">
                <td>${dev.iso}</td>
                <td>${displayTime}</td>
                ${detailsCell}
            </tr>
            ${notesRow}
        `;
    }).join('');

    wrapper.innerHTML = `
      <div class="film-name">${name}</div>
      <img class="film-image" src="${imageUrl}" alt="${name}">
      <table>
        ${tableHeader}
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;

    this.shadowRoot.append(link, wrapper);

    this.shadowRoot.querySelectorAll('.notes-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const notesRow = e.target.closest('tr').nextElementSibling;
            if (notesRow && notesRow.classList.contains('notes-row')) {
                notesRow.classList.toggle('visible');
            }
        });
    });
  }
}

customElements.define('film-card', FilmCard);

const filmData = {
    "Ilford HP5+": {
        image: "media/hp5.jpg",
        box_iso: "400",
        developments: [
            { iso: "100", time: "6", temp: "20C" },
            { iso: "200", time: "5", temp: "20C" },
            { iso: "200", time: "4:45", temp: "20C", notes: "Time for Jobo/rotary tube processor" },
            { iso: "320", time: "8", temp: "20C" },
            { iso: "400", time: "6", temp: "20C" },
            { iso: "800", time: "8", temp: "20C" },
            { iso: "1600", time: "12", temp: "20C" },
            { iso: "3200", time: "18", temp: "21C" },
        ]
    },
    "Ilford Delta 400 Pro": {
        image: "https://i.imgur.com/1QZxq3c.jpeg",
        box_iso: "400",
        developments: [
            { iso: "100", time: "5:30", temp: "20C" },
            { iso: "200", time: "6:30", temp: "20C" },
            { iso: "250", time: "7:30", temp: "20C", dilution: "1+24" },
            { iso: "400", time: "9", temp: "20C" },
            { iso: "800", time: "18:30", temp: "20C" },
            { iso: "800", time: "16", temp: "24C" },
            { iso: "3200", time: "40", temp: "20C", notes: "Agitation: continuous first 30 secs, then 1-2 inversions every 2 mins." },
        ]
    },
    "Kodak Double-X (5222)": {
        image: "https://i.imgur.com/p7c0N3u.jpeg",
        box_iso: "250",
        developments: [
            { iso: "200", time: "5", temp: "20C", dilution: "1+20" },
            { iso: "250", time: "5:45", temp: "20C" },
            { iso: "500", time: "7:30", temp: "20C" },
            { iso: "1000", time: "9:15", temp: "20C" },
            { iso: "1600", time: "10", temp: "20C", dilution: "1+20" },
        ]
    },
    "Ilford Delta 3200 Pro": {
        image: "https://i.imgur.com/A6j4f9j.jpeg",
        box_iso: "3200",
        developments: [
            { iso: "400", time: "5:30", temp: "20C" },
            { iso: "800", time: "7", temp: "20C" },
            { iso: "1000", time: "8:30", temp: "20C" },
            { iso: "1600", time: "9", temp: "20C" },
            { iso: "3200", time: "11", temp: "20C" },
            { iso: "6400", time: "18", temp: "20C", dilution: "1+15" },
            { iso: "6400", time: "20", temp: "20C" },
            { iso: "12800", time: "40", temp: "20C", notes: "I actually used the 3200 at 12800. Used Rodinal developing for 40 minutes. Very grainy, as expected, but otherwise a good develop. Started at 68 deg F, but didn't control temp, so warmed up, potentially to room temp over the development" },
        ]
    },
    "Ilford Delta 100 Pro": {
        image: "https://i.imgur.com/3b663DB.jpeg",
        box_iso: "100",
        developments: [
            { iso: "50", time: "7", temp: "20C" },
            { iso: "100", time: "9", temp: "20C" },
        ]
    },
    "Kentmere 100": {
        image: "https://i.imgur.com/9g7YSJ1.jpeg",
        box_iso: "100",
        developments: [
            { iso: "100", time: "9", temp: "20C" },
            { iso: "200", time: "13", temp: "20C", notes: "Agitation: continuous first 30 seconds, then 10 seconds every 1 minute." },
            { iso: "800", time: "40*", temp: "20C", notes: "Agitated first minute, then one minute every 10 minutes." },
            { iso: "1600", time: "N/A", temp: "20C", notes: "Agitate first 10 seconds, then agitate every minute." },
            { iso: "3200", time: "70", temp: "20C" },
        ]
    },
    "Kentmere 400": {
        image: "https://i.imgur.com/nJbB2g6.jpeg",
        box_iso: "400",
        developments: [
            { iso: "400", time: "7:30", temp: "20C" },
            { iso: "400", time: "11:30", temp: "20C", notes: "Dev time in Rodinal 1+25 are severly underdevelop at 7.5 min the recomended time for APX 400 who is well known to be kentmere 400 is 11.5 min in datasheet" },
            { iso: "800", time: "9", temp: "20C" },
            { iso: "1600", time: "25", temp: "20C" },
            { iso: "3200", time: "25", temp: "23C", notes: "I tried it once, they all came out fine, but I don't recommend pushing the Kentmere (or any other film) that hard for contrast situations like mine." },
        ]
    },
    "Kodak TMax 100": {
        image: "https://i.imgur.com/Y1Q3z5P.jpeg",
        box_iso: "100",
        developments: [
            { iso: "64", time: "5:30-6", temp: "20C", notes: "Same time applies across ASA/ISO range; Data is taken from a previous version of this film, starting point time should be similar" },
            { iso: "100", time: "6", temp: "20C" },
            { iso: "100", time: "5:30", temp: "20C", notes: "Same time applies across ASA/ISO range; Data is taken from a previous version of this film, starting point time should be similar" },
            { iso: "400", time: "8:30", temp: "20C" },
        ]
    },
    "Kodak TMax 400": {
        image: "https://i.imgur.com/L1Z3T8g.jpeg",
        box_iso: "400",
        developments: [
            { iso: "320", time: "5", temp: "20C" },
            { iso: "400", time: "6", temp: "20C" },
            { iso: "800", time: "9", temp: "20C" },
            { iso: "1600", time: "11", temp: "20C" },
            { iso: "3200", time: "17", temp: "20C" },
        ]
    },
    "Kodak TMax P3200": {
        image: "https://i.imgur.com/u5S3V3s.jpeg",
        box_iso: "3200",
        developments: [
            { iso: "1000", time: "7", temp: "20C", dilution: "1+24", notes: "Data is taken from a previous version of this film, starting point time should be similar" },
            { iso: "1250", time: "8", temp: "20C", notes: "Same time applies across ASA/ISO range; Data is taken from a previous version of this film, starting point time should be similar" },
            { iso: "3200", time: "8", temp: "20C", notes: "Same time applies across ASA/ISO range; Data is taken from a previous version of this film, starting point time should be similar" },
            { iso: "6400", time: "10:30", temp: "20C", notes: "Data is taken from a previous version of this film, starting point time should be similar" },
        ]
    },
    "Ilford FP4+": {
        image: "https://i.imgur.com/S5rN6jY.jpeg",
        box_iso: "125",
        developments: [
            { iso: "25", time: "4", temp: "20C", notes: "Agitation: continuous first 30 secs, then 10 secs every 30 secs." },
            { iso: "80", time: "7:30", temp: "20C", dilution: "1+24" },
            { iso: "125", time: "9", temp: "20C" },
            { iso: "200", time: "13", temp: "20C" },
            { iso: "400", time: "20", temp: "20C", dilution: "1+24" },
            { iso: "800", time: "35", temp: "20C", notes: "Agitation: 10 secs every min for first 5 mins, then 10 secs every 5 mins." },
        ]
    },
    "Fomapan 100": {
        image: "https://i.imgur.com/pQ4jSgG.jpeg",
        box_iso: "100",
        developments: [
            { iso: "100", time: "4", temp: "20C" },
            { iso: "200", time: "3:30", temp: "25C" },
            { iso: "400", time: "6:30", temp: "20C" },
            { iso: "400", time: "13:30", temp: "20C", notes: "For reference, manufacturer time is 6-7 min." },
            { iso: "800", time: "12", temp: "20C" },
            { iso: "1600", time: "22", temp: "20C" },
        ]
    },
    "Fomapan 200": {
        image: "https://i.imgur.com/xJJZJgY.jpeg",
        box_iso: "200",
        developments: [
            { iso: "25", time: "3:30", temp: "20C" },
            { iso: "200", time: "5", temp: "20C" },
            { iso: "800", time: "9:30", temp: "20C", notes: "15% decreased time for constant agitation in Rondinax 35u tank." },
        ]
    },
    "Fomapan 400": {
        image: "https://i.imgur.com/u4A2z8G.jpeg",
        box_iso: "400",
        developments: [
            { iso: "400", time: "5:30", temp: "20C" },
            { iso: "800", time: "10", temp: "20C" },
            { iso: "1600", time: "20", temp: "20C" },
            { iso: "3200", time: "25", temp: "20C", notes: "High Contras; Agitation: continuous first min, then 5 secs per min." },
            { iso: "6400", time: "90", temp: "20C", notes: "Semi-stand development: continuous agitation 30-60 secs, then 10 secs every 5-10 mins" },
            { iso: "6400", time: "80", temp: "20C", notes: "Agitation: Continuous first 30 seconds, then 10 seconds every minute for 20 minutes.From 20-80 agitate 10 seconds every 5 minutes.Example Images:https://flic.kr/s/aHBqjARC1z" },
        ]
    },
};

const filmContainer = document.getElementById('film-container');

for (const filmName in filmData) {
  const film = filmData[filmName];
  const card = document.createElement('film-card');
  card.setAttribute('name', filmName);
  card.setAttribute('image', film.image);
  card.setAttribute('data', JSON.stringify(film.developments));
  card.setAttribute('box-iso', film.box_iso);
  filmContainer.appendChild(card);
}
