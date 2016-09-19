<tour>
    <style scoped>
    :scope {
        font-family: 'Chelsea Market', cursive;
        text-align: left;
        font-size: 16px;
        color: gray;
        overflow: hidden;
        display: inline-block;
        border: 1px solid #dadada;
        background-color: #fff;
        height: 190px;
        width: 100%;
        box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.5);
        padding: 20px;
        margin-bottom: 25px;
    }
    :scope a {
        color: gray;
    }
    .tour__image{
        height: 100%;
    }
    .tour__image img {
        height: 150px;
        width: 150px;
    }
    .tour__container{
        display: flex;
        flex-direction: row;
        height: 100%;
        width: 100%;
    }
    .tour__info{
        position: relative;
        padding-left: 10px;
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
    }
    .tour__title{
        color: #000;
        font-weight: 700;
        font-size: 20px;
    }
    .tour__line{
        height: 1px;
        background-color: gray;
        width: 100%;
    }
    .tour__tags{
        font-size: 12px;
    }
    .tour__actions{
        position: absolute;
        bottom: 0px;
        text-align: right;
        width: 90%;
        cursor: pointer;
    }
    .tour__action{
        margin: 0 3px;
    }

    .tour__action:hover{
        color: #fed136;
    }
    </style>

    <div class='tour__container'>
        <div class='tour__image'>
            <img class="img-rounded" src="upload/tours/{imagePath}">
        </div>
        <div class='tour__info'>
            <div class='tour__title'>{title}</div>
            <div class='tour__line'></div>
            <div class='tour__tags'>{tour_tags}</div>
            <div class='tour__cost'>{cost}</div>
            <div class='tour__hotel'>{hotel.title}</div>
            <div class='tour__start-date'>{date}</div>
            <div class='tour__long'>{long}</div>
            <div class='tour__actions tour__actions_manager' if={editable}>
                <a href='#details/{id}'><i class="fa fa-eye fa-lg tour__action" aria-hidden='true'></i></a>
                <a href='#edit/{id}'><i class="fa fa-edit fa-lg tour__action" aria-hidden='true'></i></a>
                <i class="fa fa-remove fa-lg tour__action" aria-hidden='true' onclick="{remove}"></i>
            </div>

            <div class='tour__actions tour__actions_client' if={!editable}>
                <a href='#details/{id}'><i class="fa fa-eye fa-lg tour__action" aria-hidden='true'></i></a>
                <i class="fa fa-heart-o fa-lg tour__action" aria-hidden='true' onclick="{like}">{likes}</i>
            </div>

            <script>
                var self = this;
                self.id = opts.id;

                this.mixin('getNightsText');
                this.mixin('remove');

                self.long = this.getNightsText(self.nights);


                var date = new Date(self.startDate);
                self.date = date.toLocaleDateString();

                var image = self.image;
                self.imagePath = image ? image.name : "default.jpg";

                this.editable = this.parent.isManager;

                self.like = function() {
                    debugger;
                };
            </script>
        </div>
    </div>
</tour>