<tours if={!hidden}>
    <style scoped>
    :scope .tours__actions{
        text-align: right;
        padding: 10px 25px;
        color: white;
    }
    </style>

    <div class="tours__actions">
        <div class="ss-btn ss-btn-success add-btn" onclick="{create}">Создать новый тур</div>
    </div>

    <div>
        <div class="col-md-6 col-sm-6 col-xs-12 col-lg-4 " each="{ tours }">
            <tour>
            </tour>
        </div>
    </div>

    <script>
        this.tours = this.opts.tours;
        this.hidden = this.opts.hidden;
        this.isManager = this.opts.isManager;

        this.create = function() {
            riot.route('edit')
        };

        this.refresh = function(tours) {
            this.update({tours: tours, hidden: false});
        };
    </script>
</tours>