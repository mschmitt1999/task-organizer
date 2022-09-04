class Akteur{
    constructor(gruppe="alle"){
        this.name;
        this.gruppe = gruppe;
        this.currentAufgaben = new Array();   
    }
    setName(name){
        this.name = name;
    }

    getName(){
        return this.name;
    }

    setAufgabe(neueAufgabe){
        this.currentAufgaben.push(neueAufgabe);
    }

    deleteAufgabe(){
        this.currentAufgaben=new Array();
    }

    getAufgabe(){
        return this.currentAufgaben;
    }   
}



class Aufgabe{
    constructor(){
       this.name;
       this.akteur;
       this.done = false;
    }
    setName(name){
        this.name = name;
    }

    getName(){
        return this.name;
    }

}

class Plan{
    constructor(name, akteure, aufgaben,haeufigkeit,profile){
        this.profile = profile;
        this.name=name;
        this.akteure=[];
        this.setAkteure(akteure);
        this.aufgaben= [];
        this.setAufgaben(aufgaben);
        this.haeufigkeit=haeufigkeit;
        this.aufgabenVerteilung(this.setHaeufigkeit(haeufigkeit));

    }

    setAkteure(akteure){
        if(akteure!=undefined){
            for(let i=0; i<akteure.length;i++){
                this.akteure[i]= new Akteur();
                this.akteure[i].setName(akteure[i]);
            }
        }
        
    }

    setAufgaben(aufgaben){
        if(aufgaben!=undefined){
            for(let i=0; i<aufgaben.length;i++){
                this.aufgaben[i]= new Aufgabe();
                this.aufgaben[i].name= aufgaben[i];
            }
        }
        
    }
    setHaeufigkeit(haeufigkeit){
        if(haeufigkeit=="monthly"){
           return this.monthly();
        }
        else{
           return this.WeeklyAndOwnTiming(haeufigkeit);
        }
       
    }


    aufgabeHinzufuegen(name){
        let zuhinzufügendeAufgabe =new Aufgabe();
        zuhinzufügendeAufgabe.setName(name);
        this.aufgaben.push(zuhinzufügendeAufgabe);
        this.aufgabenVerteilung(this.setHaeufigkeit(this.haeufigkeit));
    }

    aufgabeLoeschen(name){
        for(let i=0; i<this.aufgaben.length;i++){
            if(this.aufgaben[i].getName()==name){
                this.aufgaben.splice(i,1);
            }
        }
        this.aufgabenVerteilung(this.setHaeufigkeit(this.haeufigkeit));
    }

   aufgabenVerteilung(hauefigkeit){
      
        for(let i=0; i<this.akteure.length;i++){
            this.akteure[i].deleteAufgabe();
       }
       for(let j=0; j<this.aufgaben.length;j++){
        this.aufgaben[j].akteur= "";
      
      if(this.akteure.length>0){
        let numberAkteure = this.akteure.length;
        let numberAufgaben = this.aufgaben.length;
        let numberMod = hauefigkeit%numberAkteure;
        let temp = numberMod;
        for(let k=0; k<numberAufgaben;k++){
            
            this.akteure[temp].setAufgabe(this.aufgaben[k]);
            this.aufgaben[k].akteur =this.akteure[temp].name;
            if(temp==numberAkteure-1){
                temp=0;
            }
            else{    
                temp++;
            }    
        }      
       }
    }
    }
    akteurHinzufuegen(akteur){
        this.akteure.push(akteur);
        this.aufgabenVerteilung(this.setHaeufigkeit(this.haeufigkeit));
    }

    deleteAkteur(name){
        let vorhanden = false;
        for(let i=0; i< this.akteure.length;i++){
            if(this.akteure[i].name==name){
                this.akteure.splice(i,1);
                vorhanden=true;
            }
        }
        if(vorhanden==true){
            for(let i=0; i< this.akteure.length;i++){
                this.akteure[i].deleteAufgabe();
            } 
        }
        this.aufgabenVerteilung(this.setHaeufigkeit(this.haeufigkeit));
    }

    WeeklyAndOwnTiming(timing=7){
        let currentDate = new Date();
        let startDate = new Date(currentDate.getFullYear(),0,1);
        let days = parseInt((currentDate.getTime()-startDate.getTime()) / (1000*60*60*24));
        let weekNumber = parseInt(days/timing)+1;
        return weekNumber;
      
    }
    monthly(){
        return new Date().getMonth();
    }
    toJsonString(){
        //muss bisher noch händisch in das JSON kopiert werden
        let jsonString="\""+ this.name+"\"" +":{\"akteure\":[";
        for(let i=0;i<this.akteure.length;i++){
            jsonString+= "\""+this.akteure[i].getName()+"\"";
            if(i<this.akteure.length-1){
                jsonString+=",";
            }
        }
        jsonString+="],\"aufgaben\":["
        for(let j=0;j<this.aufgaben.length;j++){
            jsonString+= "\""+this.aufgaben[j].getName()+"\"";
            if(j<this.aufgaben.length-1){
                jsonString+=",";
            }
        }
        jsonString+="],\"haeufigkeit\":"+this.haeufigkeit + "}";
        return jsonString;
    }
}

function defaultState(actualProfile){
    const data = JSON.parse(profiles)[actualProfile];
    let planName=Object.keys(data);
    

    let plans=[];
    for(let i=0;i<planName.length;i++){
        plans[i]= new Plan(planName[i],data[planName[i]]["akteure"],data[planName[i]]["aufgaben"],data[planName[i]]["haeufigkeit"],actualProfile);
    }
    return plans;
}



class View{
    constructor(plans){
        this.plans = plans;
        this.actualPlanIndex=0;
        this.planLinks=[];
        this.planName = document.querySelector(".planName");
        this.profileName = document.querySelector("#profileName");
        this.profileName.addEventListener("click", ()=> this.changeProfile());
        this.plansNav = document.querySelector(".plans");
        this.container=document.querySelector(".container");
        this.akteurListe = document.querySelector(".akteurListe");
        this.akteure = [];
    //header
       this.setPlanName(0);

       this.profileName.textContent=plans[0].profile;
       
       
       this.setPlansNav(0);
        ///////////////////////////////////
       

       
       this.setCards(0);
       
       // buttons
       this.buttonAkteurHinzu = document.querySelector('#akteurHinzu');
       this.buttonAkteurHinzu.addEventListener("click", () => this.setNewAkteur(this.actualPlanIndex));
       this.buttonAkteurLoeschen= document.querySelector('#akteurLoeschen');
       this.buttonAkteurLoeschen.addEventListener("click", () => this.deleteAkteur(this.actualPlanIndex));
       this.buttonAufgabenHinzu = document.querySelector('#aufgabeHinzu');
       this.buttonAufgabenHinzu.addEventListener("click", () => this.setNewAufgabe(this.actualPlanIndex));
       this.buttonAufgabeLoeschen= document.querySelector('#aufgabeLoeschen');
       this.buttonAufgabeLoeschen.addEventListener("click", () => this.deleteAufgabe(this.actualPlanIndex));
       this.buttonPlanHinzu = document.querySelector('#planHinzu');
       this.buttonPlanHinzu.addEventListener("click", () => this.createNewPlan());
       this.buttonPlanLoeschen= document.querySelector('#planLoeschen');
       this.buttonPlanLoeschen.addEventListener("click", () => this.deletePlan());
       this.buttonPrintOut = document.querySelector("#printOut");
       this.buttonPrintOut.addEventListener("click", ()=> this.printOut()) 
       this.setAkteure(this.actualPlanIndex);
    }

    printOut(){
        let dataToPrint ="\""+this.plans[0].profile+"\":{"; 
        for(let i=0; i<this.plans.length;i++){
            dataToPrint+=this.plans[i].toJsonString();
            if(i<this.plans.length-1){
                dataToPrint+=",";
            }
        }
        dataToPrint+="}";
        console.log(dataToPrint);
    }

    setAkteure(planIndex){
        this.akteurListe.innerHTML="";
        let title = document.createElement("h3");
        title.textContent="Akteure";
        this.akteurListe.appendChild(title);
        for(let i=0; i<this.plans[planIndex].akteure.length;i++){
            this.akteure[i] = document.createElement("div");
            this.akteure[i].textContent=this.plans[planIndex].akteure[i].getName();
            this.akteurListe.appendChild(this.akteure[i]);
        }
        
    }

    changeProfile(){
        this.plans=defaultState(prompt("Profile Id"));
        this.profileName.textContent=this.plans[0].profile;
        this.setPlansNav(0);
        this.setNewPlan(0);
        this.setAkteure(0);
    }

    setNewAkteur(planIndex){
        let akteur = new Akteur();
        akteur.setName(prompt("Name des Akteurs:"));
        this.plans[planIndex].akteurHinzufuegen(akteur);
        this.setNewPlan(planIndex);
        this.setAkteure(planIndex);
    }

    deleteAkteur(planIndex){
        this.plans[planIndex].deleteAkteur(prompt("Name des Akteurs:"));
        this.setNewPlan(planIndex);
        this.setAkteure(planIndex);
    }

    setNewAufgabe(planIndex){
        this.plans[planIndex].aufgabeHinzufuegen(prompt("Welche Aufgabe möchten sie hinzufügen"));
        this.setNewPlan(planIndex);
    }

    deleteAufgabe(planIndex){
        this.plans[planIndex].aufgabeLoeschen(prompt("Welche Aufgabe soll gelöcht werden?"));
        this.setNewPlan(planIndex);
    }

    createNewPlan(){
        let aufgaben= new Array();
        let akteure = new Array();
        let newPlan = new Plan(prompt("Name des Plans"),aufgaben,akteure, prompt("Wie häufig sollen aufgaben wechseln?"),this.plans[0].profile);
        let minAkteur = new Akteur();
        minAkteur.name = prompt("Min einen Akteur angeben");
        newPlan.akteure.push(minAkteur);
        newPlan.aufgabeHinzufuegen(prompt("und min eine Aufgabe"));
        this.plans.push(newPlan);
        this.setPlansNav(); 
    }

    deletePlan(name){
        if(this.plans.length>1){
            name=prompt("Name des zu löschenden Plans");
            for(let i=0; i<this.plans.length;i++){
                if(this.plans[i].name==name){
                    this.plans.splice(i,1);
                }
            }
            this.setPlansNav(); 
            this.setNewPlan(0);
        }
        else{
            alert("You have to create a new plan if you want to delete it!")
            this.createNewPlan();
            this.deletePlan(name);
        }
       
        

    }

    setNewPlan(planIndex){
        this.setPlanName(planIndex);
        this.setCards(planIndex);
        this.setAkteure(planIndex);
        this.actualPlanIndex=planIndex;
       
    }
  
    setPlansNav(){
        this.plansNav.innerHTML="";
       for(let i=0; i<this.plans.length;i++){
           this.planLinks.push(document.createElement("a"));
           this.planLinks[i].textContent=this.plans[i].name;
           this.planLinks[i].addEventListener("click", () => this.setNewPlan(i));
           this.plansNav.appendChild(this.planLinks[i]);
       }
       this.planLinks[0].style.color= "red";

       
    }
    setPlanName(planIndex){
        this.planName.textContent=this.plans[planIndex].name;
       if(this.planLinks[planIndex]!=undefined){
           for(let i=0; i<this.planLinks.length;i++){
            this.planLinks[i].style.color= "black";
           }
             this.planLinks[planIndex].style.color= "red";
             
       }
    }
    setCards(planIndex){
        this.container.innerHTML="";
       for(let j=0;j<this.plans[planIndex].aufgaben.length;j++){
           let card = document.createElement("div");
           card.classList.add("card");
           let taskParent = document.createElement("div");
           taskParent.classList.add("taskParent");
           let imgTask = document.createElement("div");
           imgTask.classList.add("imgTask");
           let task = document.createElement("div");
           task.classList.add("task");
            task.textContent=this.plans[planIndex].aufgaben[j].name;

           let akteur = document.createElement("div");
           akteur.classList.add("akteur");
           akteur.textContent=this.plans[planIndex].aufgaben[j].akteur;
           //console.log(this.plans[planIndex].aufgaben[j].akteur);
           taskParent.appendChild(imgTask);
           taskParent.appendChild(task);
           card.appendChild(taskParent);
           card.appendChild(akteur);
           this.container.appendChild(card);
         
       }
    }
   

}


let defaultPlans = defaultState("magdalena");
let view = new View(defaultPlans);
