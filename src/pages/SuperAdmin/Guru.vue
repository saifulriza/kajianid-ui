<template>
  <q-page>
    <!-- modal edit-->
    <q-dialog v-model="modalEdit">
      <q-card class="my-card q-ma-sm q-pa-sm">
        <q-card-section>
          <div class="text-h6">Edit Data</div>
        </q-card-section>
        <q-card-section>
          <div class="row flex flex-center">
            <div class="col-12">
              <q-img
                class="rounded-borders q-ma-sm q-mr-md"
                :src="profile.foto"
                style="max-widht:100px; max-height:300px"
              />
            </div>
            <div class="col-12">
              <q-file
                filled
                v-model="profileFoto"
                class="q-ma-sm"
                label="Ganti foto"
              >
                <template v-slot:append>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </div>
          </div>
          <div class="row">
            <div class="col-xl-6 col-md-6 col-sm-12">
              <q-input
                filled
                v-model="profile.nama"
                class="q-ma-sm"
                label="Nama"
              />
              <q-input filled v-model="profile.hp" class="q-ma-sm" label="Hp" />
              <q-input
                filled
                v-model="profile.tempat_lahir"
                class="q-ma-sm"
                label="Tempat lahir"
              />
              <q-input
                filled
                v-model="profile.tgl_lahir"
                class="q-ma-sm"
                mask="date"
                :rules="['date']"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="profile.tgl_lahir"
                        @input="() => $refs.qDateProxy.hide()"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-xl-6 col-md-6 col-sm-12">
              <q-input filled v-model="profile.fb" class="q-ma-sm" label="FB" />
              <q-input
                filled
                v-model="profile.twitter"
                class="q-ma-sm"
                label="Twitter"
              />
              <q-input
                filled
                v-model="profile.youtube"
                class="q-ma-sm"
                label="Youtube"
              />
              <q-input
                filled
                v-model="profile.instagram"
                class="q-ma-sm"
                label="Instagram"
              />
            </div>
            <div class="col-12">
              <q-input
                filled
                v-model="profile.lulusan"
                class="q-ma-sm"
                label="Lulusan"
              />
            </div>
            <div class="col-12">
              <q-input
                filled
                v-model="profile.profile"
                class="q-ma-sm"
                label="Profile"
              />
            </div>
            <q-btn
              color="primary"
              label="Simpan"
              class="q-ma-sm"
              @click="ubah(profile.id)"
            />
            <q-btn
              color="red"
              label="Hapus"
              class="q-ma-sm"
              @click="hapus(profile.id)"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- end modal edit -->

    <!-- modal tambah-->
    <q-dialog v-model="modalTambah">
      <q-card class="my-card q-ma-sm q-pa-sm">
        <q-card-section>
          <div class="text-h6">Tambah Data</div>
        </q-card-section>
        <q-card-section>
          <div class="row flex flex-center">
            <div class="col-6">
              <q-file standout v-model="dataTambah.foto" label="Foto">
                <template v-slot:append>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </div>
          </div>
          <div class="row">
            <div class="col-xl-6 col-md-6 col-sm-12">
              <q-input
                filled
                v-model="dataTambah.nama"
                class="q-ma-sm"
                label="nama"
              />
              <q-input
                filled
                v-model="dataTambah.hp"
                class="q-ma-sm"
                label="Hp"
              />
              <q-input
                filled
                v-model="dataTambah.tempat_lahir"
                class="q-ma-sm"
                label="Tempat lahir"
              />
              <q-input
                filled
                v-model="dataTambah.lulusan"
                class="q-ma-sm"
                label="Lulusan"
              />
              <q-input
                filled
                v-model="dataTambah.tgl_lahir"
                class="q-ma-sm"
                mask="date"
                label="Tanggal lahir"
                :rules="['date']"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="dataTambah.tgl_lahir"
                        @input="() => $refs.qDateProxy.hide()"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-xl-6 col-md-6 col-sm-12">
              <q-input
                filled
                v-model="dataTambah.fb"
                class="q-ma-sm"
                label="FB"
              />
              <q-input
                filled
                v-model="dataTambah.twitter"
                class="q-ma-sm"
                label="Twitter"
              />
              <q-input
                filled
                v-model="dataTambah.youtube"
                class="q-ma-sm"
                label="Youtube"
              />
              <q-input
                filled
                v-model="dataTambah.instagram"
                class="q-ma-sm"
                label="Instagram"
              />
            </div>
            <div class="col-12">
              <q-input
                filled
                v-model="dataTambah.profile"
                class="q-ma-sm"
                label="Profile"
              />
            </div>
          </div>
          <q-btn
            color="primary"
            label="Tambah"
            class="q-ma-sm"
            @click="tambah()"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- end modal tambah -->

    <q-btn
      color="primary"
      class="q-ma-sm"
      @click="modalTambah = true"
      label="Tambah"
    />

    <q-table
      class="q-ma-sm"
      ref="table"
      :data="serverData"
      :columns="columns"
      :filter="filter"
      row-key="name"
      :pagination.sync="serverPagination"
      :loading="loading"
      @request="request"
      @row-click="onRowClick"
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="100"
          @keyup.enter="cariGuru(cari)"
          v-model="cari"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
  </q-page>
</template>
<script>
export default {
  data() {
    return {
      profileFoto: [],
      cari: "",
      date: "2019/02/01",
      modalTambah: false,
      dataTambah: {
        fb: '',
        twitter: '',
        instagram : '',
        youtube: ''
      },
      modalEdit: false,
      kode_r: "",
      kode_e: "",
      filter: "",
      profile: {
        fb: '',
        twitter: '',
        instagram : '',
        youtube: ''
      },
      loading: false,
      serverPagination: {
        page: 1,
        sortBy: 'nama',
        descending : false,
        rowsNumber: 10
      },

      serverData: [],
      columns: [
        {
          name: "nama",
          required: true,
          label: "Nama",
          field: "nama",
          sortable: true
        },
        { name: "lulusan", label: "Lulusan", field: "lulusan", sortable: true },
        { name: "hp", label: "Hp", field: "hp", sortable: true },
        {
          name: "tgl_lahir",
          label: "TTL ",
          field: row => row.tempat_lahir + ", " + row.tgl_lahir,
          sortable:true,
        },
        { name: "fb", label: "FB", field: row => (row.fb == 'null' || row.fb === null) ? 'Belum Ada': row.fb },
        { name: "twitter", label: "Twitter", field: row => (row.twitter == 'null' || row.twitter === null) ? 'Belum Ada' : row.twitter },
        {
          name: "youtube",
          label: "Youtube",
          field:  row => (row.youtube == 'null' || row.youtube === null) ? 'Belum Ada' : row.youtube ,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
        }
        // { name: 'foto', label: 'Foto', field: 'foto', }
      ]
    };
  },
  methods: {
    hapus(id) {
      let configDelete = {
        headers: {
          //'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
          Authorization: `Bearer ${localStorage.getItem("K0lgfWr")}`
        }
      };
      let form = new FormData();
      form.append("kode_r", this.kode_r);
      form.append("kode_e", this.kode_e);

      this.$axios
        .post(
          `${process.env.API_URL}/api/v1/guru/${id}?_method=DELETE`,
          form,
          configDelete
        )
        .then(({ data }) => {
          // updating pagination to reflect in the UI

          // we also set (or update) rowsNumber
          this.serverPagination.rowsNumber = data.per_page;

          // then we update the rows with the fetched ones
          this.serverData = data.data;
          this.modalEdit = false;
          this.request({
            pagination: this.serverPagination,
            filter: this.filter
          });

          // finally we tell QTable to exit the "loading" state
          this.loading = false;
        })
        .catch(error => {
          // there's an error... do SOMETHING
          this.$q.notify({
            type: "negative",
            message: error.response.data.pesan
          });
          // we tell QTable to exit the "loading" state
          this.loading = false;
        });
    },
    cariGuru(text) {
      this.$axios
        .get(`${process.env.API_URL}/api/v1/guru/nama/${text}`)
        .then(({ data }) => {
          // updating pagination to reflect in the UI

          // we also set (or update) rowsNumber
          this.serverPagination.rowsNumber = data.per_page;

          // then we update the rows with the fetched ones
          this.serverData = data.data;

          // finally we tell QTable to exit the "loading" state
          this.loading = false;
        })
        .catch(error => {
          // there's an error... do SOMETHING
          this.$q.notify({
            type: "negative",
            message: error.response.data.pesan
          });
          // we tell QTable to exit the "loading" state
          this.loading = false;
          console.log(error);
        });
    },

    ubah(id) {
      let configEdit = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("K0lgfWr")}`,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      };
      let formEdit = new FormData();
      formEdit.append("hp", this.profile.hp);
      formEdit.append("nama", this.profile.nama);
      formEdit.append("profile", this.profile.profile);
      formEdit.append("tempat_lahir", this.profile.tempat_lahir);
      formEdit.append("tgl_lahir", this.profile.tgl_lahir);
      formEdit.append("fb", this.profile.fb );
      formEdit.append("twitter", this.profile.twitter);
      formEdit.append("youtube", this.profile.youtube);
      formEdit.append("instagram", this.profile.instagram);
      formEdit.append("lulusan", this.profile.lulusan);
      formEdit.append("profile", this.profile.profile);
      formEdit.append("foto", this.profileFoto);
      formEdit.append("lulusan", this.profile.lulusan);
      formEdit.append("kode_r", this.kode_r);
      formEdit.append("kode_e", this.kode_e);
      this.$axios
        .post(
          `${process.env.API_URL}/api/v1/guru/${id}?_method=PUT`,
          formEdit,
          configEdit
        )
        .then(({ data }) => {
          if (data.sukses) {
            this.$q.notify({
              type: "positive",
              message: `Berhasil Mengubah Data`
            });
            this.modalEdit = false;
            this.profile = {};
            this.request({
              pagination: this.serverPagination,
              filter: this.filter
            });
          } else {
            this.$q.notify({
              type: "negative",
              message: data.pesan
            });
          }
        })
        .catch(error => {
          this.$q.notify({
            type: "negative",
            message: error.response.data.pesan
          });
        });
    },

    tambah() {
      let configTambah = {
        headers: {
          //'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
          Authorization: `Bearer ${localStorage.getItem("K0lgfWr")}`,
          "Content-Type": "multipart/form-data"
        }
      };
      let form = new FormData();
      form.append("hp", this.dataTambah.hp);
      form.append("nama", this.dataTambah.nama);
      form.append("profile", this.dataTambah.profile);
      form.append("tempat_lahir", this.dataTambah.tempat_lahir);
      form.append("tgl_lahir", this.dataTambah.tgl_lahir);
      form.append("fb", this.dataTambah.fb);
      form.append("twitter", this.dataTambah.twitter);
      form.append("youtube", this.dataTambah.youtube);
      form.append("instagram", this.dataTambah.instagram);
      form.append("lulusan", this.dataTambah.lulusan);
      form.append("profile", this.dataTambah.profile);
      form.append("foto", this.dataTambah.foto);
      form.append("lulusan", this.dataTambah.lulusan);
      form.append("kode_r", this.kode_r);
      form.append("kode_e", this.kode_e);
      this.$axios
        .post(`${process.env.API_URL}/api/v1/guru`, form, configTambah)
        .then(({ data }) => {
          if (data.sukses) {
            this.$q.notify({
              type: "positive",
              message: `Berhasil Menambah Data`
            });
            this.modalTambah = false;
            this.dataTambah = {};
            this.request({
              pagination: this.serverPagination,
              filter: this.filter
            });
          } else {
            this.$q.notify({
              type: "negative",
              message: data.pesan
            });
          }
        })
        .catch(error => {
          this.$q.notify({
            type: "negative",
            message: error.response.data.pesan
          });
        });
    },
    request({ pagination, filter }) {
      // we set QTable to "loading" state
      this.loading = true;

      // we do the server data fetch, based on pagination and filter received
      // (using Axios here, but can be anything; parameters vary based on backend implementation)
      if(pagination.sortBy == null){
        pagination.sortBy = 'nama'
      }

      this.$axios
        .get(`${process.env.API_URL}/api/v1/guru?page=${pagination.page}&sortBy=${pagination.sortBy}&descending=${pagination.descending}`)
        .then(({ data }) => {
          // updating pagination to reflect in the UI
          this.serverPagination = pagination;

          // we also set (or update) rowsNumber
          this.serverPagination.rowsNumber = data.per_page;

          // then we update the rows with the fetched ones
          this.serverData = data.data;

          // finally we tell QTable to exit the "loading" state
          this.loading = false;
        })
        .catch(error => {
          this.$q.notify({
            type: "negative",
            message: error.response.data.pesan
          });
          this.loading = false;
        });
    },
    onRowClick(evt, row) {
      this.modalEdit = true;
      this.$axios
        .get(`${process.env.API_URL}/api/v1/guru/${row.id}`)
        .then(({ data }) => {
          // updating pagination to reflect in the UI
          this.profile = data.data;
          this.loading = false;
        })
        .catch(error => {
          // there's an error... do SOMETHING
          this.$q.notify({
            type: "negative",
            message: error.response.data.pesan
          });
          // we tell QTable to exit the "loading" state
          this.loading = false;
        });
    }
  },
  mounted() {
    // once mounted, we need to trigger the initial server data fetch
    this.request({
      pagination: this.serverPagination,
      filter: this.filter
    });
    this.kode_r = localStorage.getItem("kode_r");
    this.kode_e = localStorage.getItem("kode_e");
  }
};
</script>
