//Storage Controller
   const StorageCtrl = (function() {
     
      return {
        storeItem: function(item){
          let items;
 
          if(localStorage.getItem('items') === null){

            items = [];
            //Push new Item
             items.push(item);
             //Set local Storage
             localStorage.setItem('items',JSON.stringify(items));

          } else{
              //Get what is already in ls
              items=JSON.parse(localStorage.getItem('items'));

             //Push new Item
              items.push(item);

             //Reset local storage
            localStorage.setItem('items', JSON.stringify(items));
          }  
        },

         getItemFromStorage : function(){
           let items;
           if(localStorage.getItem('items') === null){
               items = [];
           }  else{
             items = JSON.parse(localStorage.getItem('items'));
           }
           return items;
         },

        updateItemStorage : function(updatedItem){

           let items = JSON.parse(localStorage.getItem('items'));

           items.forEach(function(item,index){
             if(updatedItem.id === item.id){
               items.splice(index, 1 , updatedItem);
             }
           });

          localStorage.setItem('items', JSON.stringify(items));
        },

        deleteItemFromStorage: function(id){
 
          let items = JSON.parse(localStorage.getItem('items'));

          items.forEach(function (item, index) {
            if(id === item.id) {
              items.splice(index, 1);
            }
          });
          localStorage.setItem('items', JSON.stringify(items));
        },

         clearItemsFromStorage : function(){
           localStorage.removeItem('items');
         },
      }
   })();

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

            items: StorageCtrl.getItemFromStorage(),
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

                   deleteItem: function(id){
                      const ids = data.items.map(function(item){
                        return item.id;
                      });

                      //Get index
                      const index = ids.indexOf(id);

                      //Remove item
                      data.items.splice(index, 1);
                   },

                   clearAllItems : function(){

                     data.items = [];
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
        clearBtn: '.clear-btn ',
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

           deleteListItem : function(id){
             const itemID = `#item-${id}`;
             const item = document.querySelector(itemID);
             item.remove();
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

           removeItems : function(){

             let listItems = document.querySelectorAll(UISelector.listItem)

             //Turn node list into Array

              listItems= Array.from(listItems);

              listItems.forEach(function(item){
                item.remove();
              });
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
  const App = (function(ItemCtrl,StorageCtrl,UICtrl){

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

        //Update item submit
        document.querySelector(selector.updateBtn).addEventListener('click', itemUpdateSubmit);

       //Delete item event
        document.querySelector(selector.deleteBtn).addEventListener('click',itemDeleteSubmit);

       //Back button event
         document.querySelector(selector.backBtn).addEventListener('click', UICtrl.clearEditState());

       //Clear items event
        document.querySelector(selector.clearBtn).addEventListener('click', clearAllItemClick);
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

                //Store in localStorage
                  StorageCtrl.storeItem(newItem);

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

           //Update local storage
            StorageCtrl.updateItemStorage(updatedItem);

            UICtrl.clearEditState();
           
           //console.log('update');

            e.preventDefault();
         }

         //Delete button event

         const itemDeleteSubmit = function(e){

        //Get current item
        const currentItem = ItemCtrl.getCurrentItem();

        //Delete from data structure
         ItemCtrl.deleteItem(currentItem.id);

         //Delete from UI
           UICtrl.deleteListItem(currentItem.id);

           //Get total calories  
           const totalCalories = ItemCtrl.getTotalCalories();
           //Add total calories to UI
           UICtrl.showTotalCalories(totalCalories);

           //Delete from local storage
            StorageCtrl.deleteItemFromStorage(currentItem.id);

           UICtrl.clearEditState();

          //console.log('deleted...');
          e.preventDefault();
         }

         //Clear Item event
          const clearAllItemClick = function(){

            //Delete all items from data structure
             ItemCtrl.clearAllItems();

            //Get total calories  
            const totalCalories = ItemCtrl.getTotalCalories();
            //Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

             //Remove from UI
             UICtrl.removeItems();

             //Clear from local storage
             StorageCtrl.clearItemsFromStorage();
             //Hide UL
             UICtrl.hideList();
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
  })(ItemCtrl,StorageCtrl,UICtrl);

   //Initailizing App
     App.init();