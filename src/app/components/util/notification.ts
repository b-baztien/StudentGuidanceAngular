declare var $: any;

export class Notifications {

    constructor() { }

    showNotification(icon: string, from: string, align: string, message: string, type: string, title: string) {
        // const type = ['', 'info', 'success', 'warning', 'danger'];

        $.notify({
            icon: icon,
            message: message

        }, {
            type: type,
            timer: 4000,
            placement: {
                from: from, //top bottom
                align: align //left center right
            },
            template: `<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-${type} alert-with-icon" role="alert"> 
                <button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button> 
                <i class="material-icons" data-notify="icon">${icon}</i>  
                <span data-notify="title">${title}</span>  
                <span data-notify="message">${message}</span> 
                <div class="progress" data-notify="progressbar"> 
                <div class="progress-bar progress-bar-${type}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div> 
                </div> 
                <a href="{3}" target="{4}" data-notify="url"></a> 
                </div>`
        });
    }
}
