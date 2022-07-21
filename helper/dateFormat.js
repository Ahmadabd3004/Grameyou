function dateFormat(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    date = date.toLocaleDateString('id-ID', options);
    return date
}

module.exports = dateFormat