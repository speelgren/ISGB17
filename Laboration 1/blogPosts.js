// Skapa en js-array
var blogPosts = new Array();

// Lägg in en första post i arrayen
blogPosts.push({
    nickName: "Otto Kaski",
    msgSubject: "Kråkan är vackrare!",
    timeStamp: '1939-02-18',
    msgBody: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean feugiat faucibus sem, id dictum turpis. Nulla ultricies metus at varius blandit.Praesent fermentum orci vel lorem sodales, et posuere tortor euismod.Curabitur lacinia
                consectetur nisi a aliquam.Quisque mollis mauris dui, ac pretium sem finibus et.Duis nec malesuada ligula.Fusce
                scelerisque, arcu nec scelerisque suscipit, urna dui finibus est, ac mollis turpis urna vel mi.Fusce libero nisi,
                ullamcorper eget magna vitae, sollicitudin convallis nunc.Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Morbi sollicitudin sed nunc nec posuere.Duis pharetra blandit velit nec varius.Aliquam ac efficitur nisi, in ornare
                nisi.`
});


//Exportera array för import i annan fil.
module.exports = { 'blogPosts': blogPosts };