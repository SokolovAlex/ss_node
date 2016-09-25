<photo>
    <style scoped>
        :scope .remove {
            position: absolute;
            top: 10px;
            right: 25px;
            color: white;
        }
        :scope .remove:hover {
            color: grey;
        }
        </style>


    <i class="fa fa-trash remove" aria-hidden="true" onclick={removeImage}></i>
    <img src="/upload/gallery/{name}" alt="" class="img-thumbnail">
    <div> {description} </div>


    <script>
        var self = this;

        this.description = this.opts.description;
        this.name = this.opts.name;
        this.id = this.opts.id;

        this.removeImage = function () {
            this.parent.removeImage(this.id);
        };
    </script>
</photo>