//Storage Controller

//Item Controller
  const ItemCtrl = (function(){
    
     //Item Constructor
      const Item = function(id,name,calories){
          this.id=id;
          this.name=name;
          this.calories=calories;
      }

       //Data Strcucture/State;

        const data={
            items:[
                {id:0,name:'Steak Dinner',calories:1200},
                { id: 1, name: 'Cookies', calories: 400},
                { id: 2, name: 'Eggs', calories:300},
            ],
            currentItem:null,
            totalCalories:0
        }
      
         return{
              getItems: function(){
                 return data.items;
              },
              
               addItem: function(name,calories){
                 //Create ID
                  let ID;

                  if(data.items.length > 0){
                      ID = data.items[data.items.length-1].id +1;
                  }
                  else{
                      ID=0;
                  }

                  //Calories to number
                  calories = parseInt(calories);

                   newItem = new Item(ID,name,calories);

                   //Add to items array
                    data.items.push(newItem);

                    return newItem;
               },

              logData : function() {
                 return data;
             }
         }
  })();

//UI Controller
  const UICtrl = (function(){
   
    const UISelector = {
        itemList: '#item-list',
        addBtn :'.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories'
    }
     return {
         populateItems: function(items){
            let html ='';

            items.forEach(function(item){
              html +=`
              <li id="item-${item.id}" class="collection-item">
               <strong>${item.name}:</stong>
                <em>${item.calories} Calories</em>
                 <a href="#" class="secondary-content">
                     <i class="edit-item fas fa-pencil-alt"></i>
                 </a>
              </li>
              `
            });

            document.querySelector(UISelector.itemList).innerHTML = html;
         },

         getItemInput: function () {
             return {
                 name: document.querySelector(UISelector.itemNameInput).value,

                 calories: document.querySelector(UISelector.itemCaloriesInput).value
             }
         },

         getSelectors: function(){
             return UISelector;
         },
     }
  })();

//App Controller
  const App = (function(ItemCtrl,UICtrl){

    //Load Event Listeners

      const loadEventListeners = function(){
    
        const selector = UICtrl.getSelectors();
        
        //Add UI 
         document.querySelector(selector.addBtn).addEventListener('click',itemAddSubmit);
      }  

       //Add item submit

        const itemAddSubmit = function(e){

            const input = UICtrl.getItemInput();

            //Check for name and calorie input
              if(input.name !=='' && input.calories !== ''){
                 
                //Add Item
                 const newItem = ItemCtrl.addItem(input.name,input.calories);
              }

            e.preventDefault();
        }
     
      //console.log(ItemCtrl.logData());

      return {
        init : function()  {
            //console.log('Initializing App....');
            //Fetch items with data
            const items = ItemCtrl.getItems();
             
           //Populate Items from UI
            UICtrl.populateItems(items);

          //Load Event listeners
           loadEventListeners();
        }
      }
  })(ItemCtrl,UICtrl);

   //Initailizing App
     App.init();