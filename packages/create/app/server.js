let app = require('./app');

app.boot(__dirname);
app.routing();
app.emit('pre-start');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});