<template>
  <q-page>
    <!-- modal edit-->
    <q-dialog v-model="modalEdit">
      <q-card class="my-card q-ma-sm q-pa-sm">
        <q-card-section>
          <div class="text-h6">Edit Data</div>
        </q-card-section>
        <q-card-section>
          <div class="row">
            <div class="col-xl-12">
              <q-input
                filled
                v-model="profile.name"
                class="q-ma-sm"
                label="Nama"
              />
              <q-input
                filled
                v-model="profile.email"
                class="q-ma-sm"
                label="Email"
              />
              <q-input
                filled
                v-model="password"
                class="q-ma-sm"
                label="Password baru"
              />
            </div>
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
          <div class="row">
            <div class="col-xl-12">
              <q-input
                filled
                v-model="dataTambah.name"
                class="q-ma-sm"
                label="Nama"
              />
              <q-input
                filled
                v-model="dataTambah.email"
                class="q-ma-sm"
                label="Email"
              />
              <q-input
                filled
                v-model="dataTambah.password"
                class="q-ma-sm"
                label="Password"
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
import moment from "moment";
export default {
  data() {
    return {
      password: null,
      profileFoto: [],
      cari: "",
      date: "2019/02/01",
      modalTambah: false,
      dataTambah: {},
      modalEdit: false,
      kode_r: "",
      kode_e: "",
      filter: "",
      profile: {},
      loading: false,
      serverPagination: {
        page: 1,
        rowsNumber: 10
      },

      serverData: [],
      columns: [
        {
          name: "nama",
          required: true,
          label: "Nama",
          align: "left",
          field: "name",
          sortable: true
        },
        { name: "email", label: "Email", field: "email", sortable: true },
        {
          name: "Created",
          label: "Created",
          field: row =>
            moment(row.created_at)
              .locale("id")
              .format("dddd, DD/MM/YYYY"),
          sortable: true
        },
        {
          name: "Updated",
          label: "Updated",
          field: row =>
            moment(row.updated_at)
              .locale("id")
              .format("dddd, DD/MM/YYYY"),
          sortable: true
        }
      ]
    };
  },
  methods: {
    moment,
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
          `${process.env.API_URL}/api/v1/admin-guru/${id}?_method=DELETE`,
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
          this.$q.notify({
            type: "negative",
            message: error.response.data.pesan
          });
          // there's an error... do SOMETHING

          // we tell QTable to exit the "loading" state
          this.loading = false;
        });
    },
    cariGuru(text) {
      let configCari = {
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
          `${process.env.API_URL}/api/v1/admin-guru/nama/${text}`,
          form,
          configCari
        )
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
      formEdit.append("name", this.profile.name);
      formEdit.append("email", this.profile.email);
      formEdit.append("password", this.password);
      formEdit.append("kode_r", this.kode_r);
      formEdit.append("kode_e", this.kode_e);
      this.$axios
        .post(
          `${process.env.API_URL}/api/v1/admin-guru/${id}?_method=PUT`,
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
          Authorization: `Bearer ${localStorage.getItem("K0lgfWr")}`
        }
      };
      let form = new FormData();
      form.append("name", this.dataTambah.name);
      form.append("email", this.dataTambah.email);
      form.append("password", this.dataTambah.password);
      form.append("role", "AdminGuru");
      form.append("kode_r", this.kode_r);
      form.append("kode_e", this.kode_e);
      this.$axios
        .post(
          `${process.env.API_URL}/api/v1/admin/register`,
          form,
          configTambah
        )
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
      let configGet = {
        headers: {
          //'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
          Authorization: `Bearer ${localStorage.getItem("K0lgfWr")}`
        }
      };
      let token = new FormData();
      token.append("kode_r", this.kode_r);
      token.append("kode_e", this.kode_e);

      this.$axios
        .post(
          `${process.env.API_URL}/api/v1/admin-guru?page=${pagination.page}`,
          token,
          configGet
        )
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
          // there's an error... do SOMETHING
          this.$q.notify({
            type: "negative",
            message: error.response.data.pesan
          });
          // we tell QTable to exit the "loading" state
          this.loading = false;
        });
    },
    onRowClick(evt, row) {
      this.modalEdit = true;
      let configGetId = {
        headers: {
          //'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
          Authorization: `Bearer ${localStorage.getItem("K0lgfWr")}`
        }
      };
      let token = new FormData();
      token.append("kode_r", this.kode_r);
      token.append("kode_e", this.kode_e);
      this.$axios
        .post(
          `${process.env.API_URL}/api/v1/admin-guru/${row.id}`,
          token,
          configGetId
        )
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

  beforeMount() {
    this.kode_r = localStorage.getItem("kode_r");
    this.kode_e = localStorage.getItem("kode_e");
  },
  mounted() {
    // once mounted, we need to trigger the initial server data fetch
    this.request({
      pagination: this.serverPagination,
      filter: this.filter
    });
  }
};
</script>
