<edit_tour if={!hidden}>
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
        :scope .edit_tour__uploader{
                display: inline-block;
                margin-bottom: 10px;
        }
        :scope .edit_tour__btns {
                margin-top: 40px;
        }
        </style>

        <form id='edit_tour__form'>
                <input type="hidden" name='id' value="{id}">

                <div class="row edit_tour__container">
                        <div class="col-md-7">

                                <h3> Редактирование тура</h3>

                                <br/>

                                <div class="form-group row">
                                        <label for="tour_title" class="col-xs-3 col-form-label">Заголовок</label>
                                        <div class="col-xs-6">
                                                <input class="form-control" name='title' type="text" value="{title}" id="tour_title">
                                        </div>
                                </div>

                                <div class="form-group row">
                                        <label for="tour_desc" class="col-xs-3 col-form-label">Описание</label>
                                        <div class="col-xs-6">
                                                <textarea name='description' class="form-control" rows="3" id="tour_desc">{description}</textarea>
                                        </div>
                                </div>

                                <div class="form-group row">
                                        <label for="tour_cost" class="col-xs-3 col-form-label">Цена</label>
                                        <div class="col-xs-6">
                                                <input class="form-control" name='cost' type="text" value="{cost}" id="tour_cost">
                                        </div>
                                </div>

                                <div class="form-group row">
                                        <label for="tour_duration" class="col-xs-3 col-form-label">Продолжительность</label>
                                        <div class="col-xs-6">
                                                <input class="form-control" type="number" name='nights' value="{nights}" id="tour_duration">
                                        </div>
                                </div>


                                <div class="form-group row">
                                        <label for="tour_start-date" class="col-xs-3 col-form-label">Начало</label>
                                        <div class="col-xs-6">
                                                <input class="form-control" type="text" name='start_date' value="{startDate}" id="tour_start-date">
                                        </div>
                                </div>

                                <div class="btn-group edit_tour__btns">
                                        <button type="button" class="btn btn-default" onclick={back}>Назад</button>

                                        <button type="button" class="btn btn-success" onclick={submit}>Сохранить</button>

                                        <button type="button" class="btn btn-danger" onclick={remove}>Удалить</button>
                                </div>

                        </div>
                        <div class="col-md-5 edit_tour__image-block">
                                <input type="file" name="tourImage" id='edit-tour__fileinput' class='edit_tour__uploader' onchange={changeImage} />

                                <img src="{imagePath}" id='edit_tour__image' alt="" class="img-thumbnail">
                        </div>
                </div>
        </form>

        <script>
        var self = this;
        var data = this.opts.tour;
        this.hidden = this.opts.hidden;

        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.nights = data.nights;
        this.cost = data.cost;
        this.startDate = data.startDate;

        var image = data && data.image;
        this.imagePath = image  ? '/upload/tours/' + image.name : "/upload/tours/default.jpg";

        var selectedFile;

        this.on('mount', function() {
                var $datepicker = $('#tour_start-date');

                $datepicker.datepicker({
                        startView: 1
                });

                $datepicker.on('changeDate', function() {
                        $datepicker.datepicker('hide');
                });
        });

        this.back = function() {
                riot.route('');
        };

        this.remove = function() {
                riot.route('');
        };

        this.refresh = function(data) {
                data = data || {id: '', title: '', description: '', nights: '', cost: '', startDate: '' };
                data.hidden = false;
                var image = data.image;
                data.imagePath = image  ? '/upload/tours/' + image.name : "/upload/tours/default.jpg";
                this.update(data);
        };

        this.submit = function() {
                var formElement = $("#edit_tour__form");
                var formData = new FormData(formElement[0]);

                var request = new XMLHttpRequest();
                request.open("POST", "api/tours");
                request.send(formData);

                request.onreadystatechange = function() {
                        if (request.readyState == 4 && request.status == 200) {
                                var responseData = JSON.parse(request.responseText);
                                var tourData = responseData.tour;
                                if (tourData.id) {
                                        ss.alert.success();
                                        app.updateCollection(tourData, responseData.type);
                                        riot.route('edit/' + tourData.id);
                                }
                        }
                };
        };

        this.changeImage = function() {
                var uploadEl = $('#edit-tour__fileinput');
                debugger;
                if(uploadEl[0].files.length) {
                        var selectedFile = uploadEl[0].files[0];
                        self.imagePath = URL.createObjectURL(selectedFile);
                }
        };

        </script>
</edit_tour>
