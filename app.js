//Storage Controller

//Item Controller
  const ItemCtrl = (function(){
    
     //Item Constructor
      const Item = function(id,name,calories){
          this.id=id;
          this.name=name;
          this.calories=calories;
      }

      //Data Structure/State;

        const data={
            items:[
                // {id:0,name:'Steak Dinner',calories:1200},
                // { id: 1, name: 'Cookies', calories: 400},
                // { id: 2, name: 'Eggs', calories:300},
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

                    getItemById: function (id) {

                    let found = null;

                    data.items.forEach(function(item) {
                     if (item.id === id) {
                       found = item;
                     }
                    });
    
                     return found;
                   },

                   updateItem: function(name,calories){

                     calories = parseInt(calories);

                     let found = null;

                     data.items.forEach(function(item){

                       if(item.id === data.currentItem.id){
                         item.name = name;
                         item.calories = calories;
                         found = item;
                       }
                     });

                      return found;
                   },

                  setCurrentItem: function(item){
                    
                    data.currentItem = item;
                  },

                  getCurrentItem : function(){

                    return data.currentItem;
                  },

                 getTotalCalories : function(){
                  let total = 0;

                 data.items.forEach(function(item){
                   total += item.calories;
                 });
                  //Set total calories in data structure
                  data.totalCalories = total;
                  
                  return data.totalCalories;
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
        listItem : '#item-list li',
        addBtn :'.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
         backBtn: '.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        countTotalCalories: '.total-calories'
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

          addListItem: function(item){
             //Show the list
              document.querySelector(UISelector.itemList).style.display = 'block';

            //Create li element
             const li = document.createElement('li');  

             //Add class
             li.className = 'collection-item';
             //Add Id
             li.id =`item-${item.id}`;
             //Add HTML
             li.innerHTML = `
                <strong>${item.name}: </stong> <em>${item.calories} Calories</em>
                 <a href="#" class="secondary-content">
                  <i class="edit-item fas fa-pencil-alt"></i>
                 </a>
             `
             //Insert Item
             document.querySelector(UISelector.itemList).insertAdjacentElement('beforeend', li);
          },

           updateListItem : function(item){

             let listItems = document.querySelectorAll(UISelector.listItem);

             //Turn nodelist into array
              listItems = Array.from(listItems);

              listItems.forEach(function(listItem){

                const itemID = listItem.getAttribute('id');

                if(itemID == `item-${item.id}`){
                  document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </stong> <em>${item.calories} Calories</em>
                 <a href="#" class="secondary-content">
                  <i class="edit-item fas fa-pencil-alt"></i>
                 </a>`
                }
              });
           },

           clearInput: function(){
             document.querySelector(UISelector.itemNameInput).value='';
             document.querySelector(UISelector.itemCaloriesInput).value ='';
          },

           addItemToForm : function(){
             document.querySelector(UISelector.itemNameInput).value = ItemCtrl.getCurrentItem().name;
             document.querySelector(UISelector.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
             UICtrl.showEditState();
           },

          hideList: function(){
           document.querySelector(UISelector.itemList).style.display = 'none';
          },

          showTotalCalories : function(totalCalories){
            document.querySelector(UISelector.countTotalCalories).textContent = totalCalories;
          },

          clearEditState : function(){
            UICtrl.clearInput();
            document.querySelector(UISelector.updateBtn).style.display = 'none';
            document.querySelector(UISelector.deleteBtn).style.display = 'none';
            document.querySelector(UISelector.backBtn).style.display = 'none';
            document.querySelector(UISelector.addBtn).style.display = 'inline';
          },

          showEditState : function(){

            document.querySelector(UISelector.updateBtn).style.display = 'inline';
            document.querySelector(UISelector.deleteBtn).style.display = 'inline';
            document.querySelector(UISelector.backBtn).style.display = 'inline';
            document.querySelector(UISelector.addBtn).style.display = 'none';
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
        
        //Add Item event 
         document.querySelector(selector.addBtn).addEventListener('click',itemAddSubmit);

        //Disable submit on enter
        document.addEventListener('keypress',function(e){
           if(e.keyCode === 13 || e.which === 13){
             e.preventDefault();
             return false;
           }
         })

        //Edit icon click event
        document.querySelector(selector.itemList).addEventListener('click', itemEditClick);

        document.querySelector(selector.updateBtn).addEventListener('click', itemUpdateSubmit);
      }  

       //Add item submit

        const itemAddSubmit = function(e){

            const input = UICtrl.getItemInput();

            //Check for name and calorie input
              if(input.name !=='' && input.calories !== ''){
                 
                //Add Item
                 const newItem = ItemCtrl.addItem(input.name,input.calories);

                 //Add item to UI list
                  UICtrl.addListItem(newItem);

                 //Get Total Calories
                  const totalCalories = ItemCtrl.getTotalCalories();
                  //Add total calories to UI
                  UICtrl.showTotalCalories(totalCalories);

                //Clear fields
                 UICtrl.clearInput();
              }           

            e.preventDefault();
        }

        //Click edit item
         const itemEditClick = function(e) {
           
         if(e.target.classList.contains('edit-item')){ 

          const listId = e.target.parentNode.parentNode.parentNode.id;

          //Brak into an array
          const listIdArr= listId.split('-');
          
          //Get the actual id
           const id = parseInt(listIdArr[1]);

           //Get item
           const itemToEdit = ItemCtrl.getItemById(id);

            //Set current item
             ItemCtrl.setCurrentItem(itemToEdit);

            //Add item to form
             UICtrl.addItemToForm();

             //console.log(itemToEdit);
         }

           e.preventDefault();
         } 

         //Update item Submit

         const itemUpdateSubmit = function(e) {
           
          //Get item input
           const input = UICtrl.getItemInput();

           //Update item
            const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

            //Update UI 
            UICtrl.updateListItem(updatedItem);

           //Get total calories  
           const totalCalories = ItemCtrl.getTotalCalories();
           //Add total calories to UI
           UICtrl.showTotalCalories(totalCalories);

           UICtrl.clearEditState();
           
           //console.log('update');

            e.preventDefault();
         }
     
      //console.log(ItemCtrl.logData());

      return {
         init : function() {

            //Clear edit state / set initial state
              UICtrl.clearEditState();

            //console.log('Initializing App....');
            //Fetch items with data
            const items = ItemCtrl.getItems();
             
            if(items.length === 0){
              UICtrl.hideList();
            }
            else{
           //Populate Items from UI
            UICtrl.populateItems(items);
            }

          //Get Total Calories
          const totalCalories = ItemCtrl.getTotalCalories();
          //Add total calories to UI
          UICtrl.showTotalCalories(totalCalories);

          //Load Event listeners
           loadEventListeners();
        }
      }
  })(ItemCtrl,UICtrl);

   //Initailizing App
     App.init();