<details_tour if={!hidden}>
    <style scoped>
    :scope .edit_tour__container{
        background-color: white;
        border: 1px solid silver;
        padding: 25px;
    }
    :scope #edit_tour__image{
        height: 350px;
        width: 350px;
    }
    :scope .edit_tour__image-block{
        text-align: center;
    }
    :scope .cost{
        background-color: #0f0;
        display: inline-block;
        border-radius:3px;
        font-size: 20px;
        padding: 10px 20px;
        margin: 10px 0;
    }
    :scope .edit_tour__btns {
        margin-top: 40px;
    }
    </style>

    <div class="row edit_tour__container">
        <div class="col-md-7">

            <h3> {title} </h3>

            <br/>

            <div>
                {description}
            </div>

            <div class="form-group row">
                <div class="cost">
                     {cost}
                </div>
            </div>

            <div class="form-group row">
                <label class="col-xs-3 col-form-label">Продолжительность</label>
                <div class="col-xs-6">
                    {nightsText}
                </div>
            </div>


            <div class="form-group row">
                <label class="col-xs-3 col-form-label">Начало тура</label>
                <div class="col-xs-6">
                    {date}
                </div>
            </div>

            <div class="btn-group edit_tour__btns">
                <button type="button" class="btn btn-default" onclick={back}>Назад</button>
            </div>

            </div>
            <div class="col-md-5 edit_tour__image-block">
                <img src="{imagePath}" id='edit_tour__image' alt="" class="img-thumbnail">
            </div>
    </div>

    <script>
        var self = this;
        var data = this.opts.tour;
        this.hidden = this.opts.hidden;

        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.cost = data.cost;

        var date = new Date(data.startDate);
        self.date = date.toLocaleDateString();

        var image = data && data.image;
        this.imagePath = image  ? '/upload/tours/' + image.name : "/upload/tours/default.jpg";

        this.mixin('getNightsText');

        this.nightsText = this.getNightsText(data.nights);

        this.back = function() {
            riot.route('');
        };

        this.refresh = function(data) {
            data = data || {id: '', title: '', description: '', nights: '', cost: '', startDate: '' };
            data.hidden = false;
            var image = data.image;
            data.nightsText = this.getNightsText(data.nights);
            data.imagePath = image  ? '/upload/tours/' + image.name : "/upload/tours/default.jpg";
            this.update(data);
        };
    </script>
</details_tour>
