function  printSubCartelera( age, 
                            icon, 
                            selectedMonth=(new Date()).getMonth()
                            )
{
    
    //get cartelera_data for selected month
    let cartelera_month_data = cartelera_data[selectedMonth + 1];

    //array for activities of the month
    let arrayActivities = new Array();

    if(Object.keys(cartelera_month_data["category"]).length === 0) {
        let toPrint = `
        <div class="col-12 Sub_Cartelera_Container">
            <div class="row header">
                <div class="col-8 title">
                    <span>Cartelera del més de ${meses_data[selectedMonth]}</span>
                </div>         
                <div class="col-4 icon">
                    <img src="${icon}" alt="icono de cartelera" />   
                </div>
                <div class="secondBg"></div>
            </div>
        
        
            <div class="col-12 msg_container">
                    No se encontraron actividades para este mes.
            </div>`;

        let action_window = document.getElementsByClassName("Index_Ventana_Accion")[0];
        action_window.innerHTML = toPrint;

        return;
    }

    for(let i = 1; i <= Object.keys(cartelera_month_data["category"]).length; i++){
        arrayActivities.push( cartelera_month_data["category"][i]["name"] );
    }

    //get all states with activities for this month
    let arrayStates = new Array();
    for(let i = 1; i <= Object.keys(cartelera_month_data["category"]).length; i++){
        for(let j = 1; j <= Object.keys(cartelera_month_data["category"][i]["activity"]).length; j++){
            if( !arrayStates.includes( cartelera_month_data["category"][i]["activity"][j]["state"] ) ){
                arrayStates.push( cartelera_month_data["category"][i]["activity"][j]["state"] );
            }            
        }
    }

    arrayStates.sort();


    let toPrint = `
        <div class="col-12 Sub_Cartelera_Container">
            <div class="row header">
                <div class="col-8 title">
                    <span>Cartelera del més de ${meses_data[selectedMonth]}</span>
                </div>         
                <div class="col-4 icon">
                    <img src="${icon}" alt="icono de cartelera" />   
                </div>
                <div class="secondBg"></div>
            </div>

            <div class="row filters">
                <div class="col-12 first">
                    Filtrar cartelera por:
                </div>                 
                <div class="col-4 formContainer">
                    <label for="stateFilter">Estados:</label> <br>
                    <select id="stateFilter" onChange="filterCartelera(${selectedMonth})">
                        <option value="0" selected>Todos los estados:</option>
    `;
                for( let i = 0; i < arrayStates.length; i++){
                    toPrint += `
                        <option value="${arrayStates[i]}">${arrayStates[i]}</option>
                    `;
                }
    toPrint += `
                    </select>
                </div>
                <div class="col-4 formContainer">
                    <label for="categoryFilter">Actividades:</label> <br>
                        <select id="categoryFilter" onChange="filterCartelera(${selectedMonth})">
                            <option value="0" selected>Todas las actividades</option>
        `;
                    for( let i = 0; i < arrayActivities.length; i++){
                        toPrint += `
                            <option value="${i+1}">${arrayActivities[i]}</option>
                        `;                        
                    }
        toPrint += `
                        </select>
                </div>
                <div class="col-4 formContainer">
                    <label for="ageFilter">Edades:</label> <br>
                    <select id="ageFilter" onChange="filterCartelera(${selectedMonth})">
                        <option value="0">Todas las edades</option>
                        <option value="1">de 1 a 5 años</option>
                        <option value="2">de 6 a 12 años</option>
                        <option value="3">de 13 años en adelante</option>
                    </select>
                </div>
            </div>

            <div class="row cartelera_area">
            </div>
        </div>
    `;    

    let action_window = document.getElementsByClassName("Index_Ventana_Accion")[0];
    action_window.innerHTML = toPrint;

    //function from this script
    markSelectedAge( parseInt(age), selectedMonth );
}

//mark selected age on ageFilter
function markSelectedAge( age, month ) {
    let selectForm = document.getElementById("ageFilter");
    
    for (let i = 0; i < selectForm.length; i++) {
        if( age === parseInt(selectForm[i].value) ){
            selectForm[i].selected = true;
        }
    }

    // function from this script
    filterCartelera( month );
}

//apply all filters
function filterCartelera( month, carousel = true ) {
    //get filter parameters
    let age = parseInt(document.getElementById("ageFilter").value);
    let category = parseInt(document.getElementById("categoryFilter").value);
    let state = document.getElementById("stateFilter").value;

    //generate a new array with original cartelera data
    let new_month_data = JSON.parse(JSON.stringify(cartelera_data[month + 1]));
    
    //apply filters    
    for(let i = 1; i <=  Object.keys(cartelera_data[month + 1]["category"]).length; i++){

        // 1st filter categories
        if( category !== 0 ) {      //if some category filter is selected
            if( i !== category ){       //if iteration is !== to selected category
                if( typeof( new_month_data["category"][i] ) !== 'undefined' ) {   //if cathegory still exists
                    delete new_month_data["category"][i];
                }
            }            
        }

        for(let j = 1; j <= Object.keys(cartelera_data[month + 1]["category"][i]["activity"]).length; j++){

            // 2nd filter age
            if( age !== 0 ) {   //if some age filter is selected
                if( typeof(new_month_data["category"][i]) !== 'undefined' ) {    //if this category still exists
                    if( cartelera_data[month + 1]["category"][i]["activity"][j]["age_type"] !== age &&
                        cartelera_data[month + 1]["category"][i]["activity"][j]["age_type"] !== 0 
                    ){  //if this element is not for the selected age and eiter zero(all ages)
                        if( typeof( new_month_data["category"][i]["activity"][j]["age_type"] ) ) {  //if this element still exists
                            delete new_month_data["category"][i]["activity"][j];
                        }                        
                    }   
                }
            }

            // 3d filter state
            if( state !== "0") {       //if some state filter is selected
                if( typeof(new_month_data["category"][i]) !== 'undefined' ) {    //if this category still exists
                    if( typeof( new_month_data["category"][i]["activity"][j] ) !== 'undefined') {    //if this activity still exists
                        if( cartelera_data[month + 1]["category"][i]["activity"][j]["state"] !== state ){   //if this activity has a diferent state to selected state
                            delete new_month_data["category"][i]["activity"][j]; 
                        }
                    }
                }
            }
        }
    }    
    
    printFilteredData( new_month_data, carousel );
}

//print filtered data
function printFilteredData( data, carousel ) { 
    // console.log(data);
    let toPrint = ``;
    let arrayOfCategory = new Array();

    for (let i = 0; i < Object.keys(data["category"]).length; i++) {
        let key1 = Object.keys(data["category"])[i]
        arrayOfCategory.push( key1 );

        toPrint += `
            <div class="col-12 activityTitle">
                ${ data["category"][key1]["name"] }
            </div>
            <div class="col-12 category_container">
                <div class="category_list_${key1}">
        `;

        if( Object.keys( data["category"][key1]["activity"] ).length > 0 ){
            for (let j = 0; j < Object.keys( data["category"][key1]["activity"] ).length; j++) {
                let key2 = Object.keys( data["category"][key1]["activity"] )[j];

                //preset some variables
                //header background
                let background = ( data["category"][key1]["activity"][key2]["thumbnail"] !== "" )
                            ? data["category"][key1]["activity"][key2]["thumbnail"]
                            : data["category"][key1]["thumbnail"];
                //which type of age
                let age_type = tipo_publico[ data["category"][key1]["activity"][key2]["age_type"] ]
                            
                toPrint += `
                    <div class="card_container">
                        <div class="card">
                            <div 
                                class="head" 
                                style="
                                    background:url('${background}');
                                    background-size: 100%;
                                "
                            >
                                <div class="title">
                                    ${data["category"][key1]["activity"][key2]["name"]}
                                </div>                            
                            </div>             
                            <div class="body">
                                <div class="state">
                                    ${data["category"][key1]["activity"][key2]["state"]} <br>
                                    <span>
                                        ${data["category"][key1]["activity"][key2]["city"]}
                                    </span>                                    
                                </div>
                                <div class="age">
                                    ${age_type}
                                </div>
                                <div class="author">
                                    ${data["category"][key1]["activity"][key2]["author"]}
                                </div>
                                <div class="description">
                                    ${data["category"][key1]["activity"][key2]["description"]}
                                </div>
                                <div class="schedule">
                                    ${data["category"][key1]["activity"][key2]["days"]}
                                    ${data["category"][key1]["activity"][key2]["hour"]}
                                </div>
                                <div class="hour">
                                    
                                </div>
                                <div class="other">
                                    ${data["category"][key1]["activity"][key2]["other"]}
                                </div>
                            </div>
                            <div class="footer">
                                <div class="direction">
                                    <div class="place"> ${data["category"][key1]["activity"][key2]["place"]} </div>
                                    <div class="area"> ${data["category"][key1]["activity"][key2]["area"]} </div>
                                    <div class="dir"> ${data["category"][key1]["activity"][key2]["direction"]} </div>
                                </div>                                
                            </div>               
                        </div>
                    </div>
                `;
            }
        } else {
            toPrint += `<div class="card_container">
                            <div class="card">
                                No se encontraron resultados para esta búsqueda.
                            </div>
                        </div>
            `;
        }
            

        toPrint += `
                </div>
            </div>
        `;
    }

    document.getElementsByClassName('cartelera_area')[0].innerHTML = toPrint;

    // console.log(carousel);
    if(carousel){
        arrayOfCategory.forEach( (elm) => {
            new Siema({
                selector: '.category_list_'+elm,
                duration: 200,
                easing: 'ease-out',
                perPage: {
                    576: 1,
                    768: 2,
                    1024: 3.2,
                },
                startIndex: 0,
                loop: false,
            });
        });
    }
}