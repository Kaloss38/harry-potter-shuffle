import "@babel/polyfill";

$(document).ready(function(){

   //Url from harry potter api
   const urlApi = 'http://hp-api.herokuapp.com/api/characters';
   //Container for instanciate Shuffle JS
   const container = $('.my-shuffle-container');

   $.getJSON(
      urlApi, 
         function(data){
            //Get and display data into DOM from api
            for(let i = 0; i < data.length; i++){
               const houseCondition = data[i].house ? data[i].house : "inconnu";
               const yearOfBirthCondition = data[i].yearOfBirth ? data[i].yearOfBirth : "Inconnu";
               $(container).append(`
                  <div class="card col-12" data-groups='["${houseCondition}"]' data-gender="${data[i].gender}" data-title="${data[i].name.toLowerCase()}" data-date-created="${data[i].yearOfBirth}">
                     <div class="card-body">
                        <div class="card-text">${data[i].name}</div>
                        <div class="card-text"> ${houseCondition}</div>
                        <div class="card-text"> ${data[i].gender}</div>
                        <div class="card-text"> ${yearOfBirthCondition}</div>
                     </div>
                  </div>
               `)
            }

            //Slider range settings
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
                  $('body').data('filter-radio', radioValue)
                  filter()
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
                              $('body').data('filter-radio-female', radioValue)
                              filter();
                           }
                        })
                     }
                  
               }
            })

            //Event button filter
            $('button').each(function(){
               $(this).on('click', function(){
                  $('button').not(this).removeClass('active')
                  const attrId = $(this).attr('id')
                  if($(this).attr('id') == 'All'){
                     $(this).addClass('active');
                     $('body').data('data-house', attrId);
                     shuffleInstance.group = attrId;
                     shuffleInstance.filter();
                     $('.radio [type=radio]').prop('checked', false);
                     $('#radio-pop').empty();
                  }
                  else{
                     $(this).addClass('active')
                     $('body').data('data-house', attrId);
                     shuffleInstance.group = attrId;
                     filter();
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
               valMin = valueTab[0];
               valMax = valueTab[1];
               $('body').data("filter-range", {min: valMin, max: valMax});
               filter();
             });

            //Event search bar filter 
            $('#search-bar').on('keyup', function (e) { 
               const searchValue = e.target.value.toLowerCase().trim();
               $('body').data('data-search', searchValue);
               filter();
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
             
            function filter(){
               shuffleInstance.filter(function(container){
                  let isElementInCurrentGroup = true;
                  const groups = JSON.parse($(container).attr('data-groups'));
                  
                  if(shuffleInstance.group !== Shuffle.ALL_ITEMS){
                     isElementInCurrentGroup = groups.indexOf(shuffleInstance.group) !== 1;
                  }

                  const dataButton = $('body').data('data-house');
                  if(dataButton){
                     const titleElement = $(container).attr('data-groups');
                     const titleText = titleElement ? titleElement.trim() : "";

                     isElementInCurrentGroup &= titleText.indexOf(dataButton) !== -1;
                  }

                  const dataSearchValue = $('body').data('data-search')
                  if(dataSearchValue){
                     const titleElement = $(container).attr('data-title')
                     const titleText = titleElement ? titleElement.toLowerCase().trim() : "";

                     isElementInCurrentGroup &= titleText.indexOf(dataSearchValue) !== -1;
                  }
                  
                  
                  const radioFilter = $('body').data('filter-radio');
                  if(radioFilter){
                     const gender = $(container).attr('data-gender')
                     isElementInCurrentGroup &= gender == radioFilter;
                  }

                  const rangeFilter = $('body').data('filter-range');
                  if(rangeFilter){
                     const valMin = parseFloat(rangeFilter.min);
                     const valMax = parseFloat(rangeFilter.max);
                     isElementInCurrentGroup &= $(container).attr('data-date-created') >= valMin
                                                && $(container).attr('data-date-created') <= valMax            
                  }

                  const pairYearFilter = $('body').data('filter-radio-female')
                  if(pairYearFilter && radioFilter == 'female'){
                     isElementInCurrentGroup &= $(container).attr('data-date-created')%2 == 0;
                  }

                  return isElementInCurrentGroup
               })
            }
   })
})



    

