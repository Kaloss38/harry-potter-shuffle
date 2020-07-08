import "@babel/polyfill";

$(document).ready(function(){

   const urlApi = 'http://hp-api.herokuapp.com/api/characters';
   const container = $('.my-shuffle-container');

   $.getJSON(
      urlApi, 
         function(data){
            for(let i = 0; i < data.length; i++){
               const houseCondition = data[i].house ? data[i].house : "inconnu";
               const yearOfBirthCondition = data[i].yearOfBirth ? data[i].yearOfBirth : "Inconnu";
               $(container).append(`
                  <div class="card col-sm-4" data-groups='["${houseCondition}", "${data[i].gender}"]' data-gender="${data[i].gender}" data-title="${data[i].name.toLowerCase()}" data-date-created="${data[i].yearOfBirth}">
                     <div class="card-body">
                     <h3 class="card-title">${data[i].name}</h5>
                     <p class="card-text" style="font-weight: bold">Maison</p>
                     <p class="card-text"> ${houseCondition}</p>
                     <p class="card-text" style="font-weight: bold">Genre</p>
                     <p class="card-text"> ${data[i].gender}</p>
                     <p class="card-text" style="font-weight: bold">Année de naissance</p>
                     <p class="card-text"> ${yearOfBirthCondition}</p>
                     </div>
                  </div>
               `)
            }

            //Slider range setting
            $('#label-range').text("Trier personnage par année: ");
            $("#slider-range").slider({
               min: 1900, 
               max: 2000, 
               focus: true, 
               value: [1910, 1990]
            });


            const Shuffle = window.Shuffle;

            const sizer = $('.my-sizer-element');
            
            let options = {
               itemSelector: '.card'
            }

            const shuffleInstance = new Shuffle( container , options);
            
            //Event radio filter
            $('.radio [type=radio]').change( function(){
               if($(this).prop('checked', true)){
                  $('#radio-pop').empty();
                  let radioValue = $(this).attr("value");
                  shuffleInstance.filter(function(container){
                     if (shuffleInstance.group !== Shuffle.ALL_ITEMS) {
                        let groups = JSON.parse($(container).attr('data-groups'));
                        const isElementInCurrentGroup = groups.indexOf(shuffleInstance.group) !== -1;
                        if (!isElementInCurrentGroup) {
                          return false;
                        }
                     }
                     if(radioValue == "female"){
                        $('#radio-pop').empty();
                        $('#radio-pop').append(`
                        <div class="input-group" data-toggle="buttons">
                           <label> 
                              <input id="checkbox-pair" type="checkbox" name="pair" aria-label="checkbox trier années pairs">
                              <span>Trier années pairs</span>
                           </label>
                        </div>
                        `)
                        $('#checkbox-pair').change( function(){
                           if($(this).prop('checked')){
                              shuffleInstance.filter(function(container){
                                 if (shuffleInstance.group !== Shuffle.ALL_ITEMS) {
                                    const groups = JSON.parse($(container).attr('data-groups'));
                                    const isElementInCurrentGroup = groups.indexOf(shuffleInstance.group) !== -1;
                                    if (!isElementInCurrentGroup) {
                                      return false;
                                    }
                                 }
                                 
                                 return container.getAttribute('data-date-created')%2 == 0;
                              })
                           }
                        })
                     }
                        return container.getAttribute('data-gender') == radioValue;
                  })
               }
            })

            //Event button filter
            $('button').each(function(){
               $(this).on('click', function(){
                  $('button').not(this).removeClass('active')
                  const attrId = $(this).attr('id')
                  if($(this).attr('id') == 'All'){
                     $(this).addClass('active');
                     shuffleInstance.filter( function(){
                        if (shuffleInstance.group !== Shuffle.ALL_ITEMS) {
                           const groups = JSON.parse($(container).attr('data-groups'));
                           const isElementInCurrentGroup = groups.indexOf(shuffleInstance.group) !== -1;
                           if (!isElementInCurrentGroup) {
                             return false;
                           }
                        }
                        return Shuffle.ALL_ITEMS
                     })
                     $('.radio [type=radio]').prop('checked', false)
                     $('#radio-pop').empty();
                  }
                  else{
                     $(this).addClass('active')
                     shuffleInstance.filter(attrId)
                     $('.radio [type=radio]').prop('checked', false)
                     $('#radio-pop').empty();
                  }
               })
            })
            //Event range filter
            $("#slider-range").change(function(){
               let valMin;
               let valMax;

               let valueTab = $(this).prop('value').split(',');
               valMin = valueTab[0]
               valMax = valueTab[1]
               
               shuffleInstance.filter(function (container) {
                  if (shuffleInstance.group !== Shuffle.ALL_ITEMS) {
                     const groups = JSON.parse($(container).attr('data-groups'));
                     const isElementInCurrentGroup = groups.indexOf(shuffleInstance.group) !== -1;
                     if (!isElementInCurrentGroup) {
                       return false;
                     }
                  }
                  return $(container).attr('data-date-created') >= valMin && $(container).attr('data-date-created') <= valMax;
                });
             });
            //Event search bar filter 
            $('#search-bar').on('keyup', function (e) { 
               const searchValue = e.target.value.toLowerCase().trim();
               console.log($(container).attr('data-groups'))
               shuffleInstance.filter( function(container){

                  if (shuffleInstance.group !== Shuffle.ALL_ITEMS) {
                     const groups = JSON.parse($(container).attr('data-groups'));
                     const isElementInCurrentGroup = groups.indexOf(shuffleInstance.group) !== -1;
                     if (!isElementInCurrentGroup) {
                       return false;
                     }
                  }

                  const titleElement = $(container).attr('data-title')
                  const titleText = titleElement.toLowerCase().trim()

                  return titleText.indexOf(searchValue) !== -1;
               })
            });

            //Event select sort
            $("#select-sort").change(function(e) {
               let value = e.target.value.trim()

               function sortByDate(container){
                  return $(container).attr('data-date-created');
               }

               function sortByTitle(container) {
                  return $(container).attr('data-title').toLowerCase().trim();
               }

               let options;
               if (value === 'data-date-created') {
                  options = {
                    by: sortByDate,
                  };
                } else if (value === 'data-title') {
                  options = {
                    by: sortByTitle,
                  };
                } else {
                  options = {};
                }
                shuffleInstance.sort(options);
             });
             
            
   })
})

    

