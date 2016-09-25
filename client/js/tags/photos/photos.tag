<photosList>
    <style scoped>
        :scope .btn_row{
            width: 300px;
            margin-top: 30px;
            text-align: center;
        }

        :scope .ss_fileinput {
            display: inline-block;
        }

        :scope .image_desciption {
            width: 250px;
        }
    </style>


    <div>

        <div class="row">
            <form id='image__form'>

                <div class="col-md-7">
                    <img src="{imagePath}" name='selectedFile' alt="" class="img-thumbnail">
                 </div>

                <div class="col-md-5">
                    <div class="btn_row">
                        <input type="file" name="selectedFile" class='ss_fileinput' onchange={changeImage} />
                    </div>
                    <div class="btn_row">
                        <div><b>Описание:</b></div>
                        <textarea type="text" name="image_description" class='image_desciption'>
                            {imageDescription}
                        </textarea>
                    </div>
                    <div class="btn_row">
                        <div class='btn btn-success' onclick={saveImage}> Сохранить </div>
                    </div>
                </div>
            </form>
        </div>

        <div class="row">

            <h3> Уже сохраненные: </h3>

            <div class="col-md-4 col-sm-6 col-xs-12 col-lg-3" each="{ images }">
                <photo></photo>
            </div>

        </div>
    </div>


    <script>
        var self = this;
        this.imageDescription = '';
        this.images = this.opts.images;

        var defaultImage = "/upload/default.jpg";
        this.imagePath = defaultImage;

        this.changeImage = function() {
            var uploadEl = $('.ss_fileinput');
            if(uploadEl[0].files.length) {
                var selectedFile = uploadEl[0].files[0];
                self.imagePath = URL.createObjectURL(selectedFile);
            }
        };

        this.removeImage = function (id) {
            debugger;
        };

        this.clear = function() {
            self.update({imageDescription: ' ', imagePath: defaultImage});
            var $el = $('.ss_fileinput');
            $el.wrap('<form>').closest('form').get(0).reset();
            $el.unwrap();
        };

        this.saveImage = function() {
            var imageForm= $('#image__form');
            var formData = new FormData(imageForm[0]);

            var request = new XMLHttpRequest();
            request.open("POST", "api/photos");
            request.send(formData);

            request.onreadystatechange = function() {
                if (request.readyState == 4 && request.status == 200) {
                    var responseData = JSON.parse(request.responseText);
                    var imageData = responseData.image;
                    if (imageData && imageData.id) {
                        ss.alert.success();
                        app.updateCollection(imageData);
                        self.clear();
                    }
                }
            };
        };
    </script>
</photosList>