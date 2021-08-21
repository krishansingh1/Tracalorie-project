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
             logData : function() {
                 return data;
             }
         }
  })();

//UI Controller
  const UICtrl = (function(){
   
  })();

//App Controller
  const App = (function(ItemCtrl,UICtrl){
     
      //console.log(ItemCtrl.logData());

      return {
        init : function()  {
            console.log('Initializing App....');
        }
      }
  })(ItemCtrl,UICtrl);

   //Initailizing App
     App.init();