<template>
  <q-page>
    <!-- semua jadwal -->
    <div class="q-pa-md">
      <div class="q-ma-sm flex flex-center">
        <q-btn outline color="primary">
          Daftar Kajian Yang Akan Datang
        </q-btn>
      </div>
      <!-- skeleton -->
      <q-markup-table v-if="loading">
        <thead>
          <tr>
            <th class="text-left" style="width: 150px">
              <q-skeleton animation="blink" type="text" />
            </th>
            <th class="text-right">
              <q-skeleton animation="blink" type="text" />
            </th>
            <th class="text-right">
              <q-skeleton animation="blink" type="text" />
            </th>
            <th class="text-right">
              <q-skeleton animation="blink" type="text" />
            </th>
            <th class="text-right">
              <q-skeleton animation="blink" type="text" />
            </th>
            <th class="text-right">
              <q-skeleton animation="blink" type="text" />
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="n in 4" :key="n">
            <td class="text-left">
              <q-skeleton animation="blink" type="text" width="85px" />
            </td>
            <td class="text-right">
              <q-skeleton animation="blink" type="text" width="50px" />
            </td>
            <td class="text-right">
              <q-skeleton animation="blink" type="text" width="35px" />
            </td>
            <td class="text-right">
              <q-skeleton animation="blink" type="text" width="65px" />
            </td>
            <td class="text-right">
              <q-skeleton animation="blink" type="text" width="25px" />
            </td>
            <td class="text-right">
              <q-skeleton animation="blink" type="text" width="85px" />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
      <!-- end skeleton -->
      <q-markup-table flat bordered v-if="!loading">
        <thead class="bg-primary">
          <tr style="color:white">
            <th class="text-left" @click="sort('hari')" style="cursor:pointer">
              <span>
                <i
                  :class="[
                    currnetSortDir === 'asc'
                      ? 'fas fa-arrow-up'
                      : 'fas fa-arrow-down'
                  ]"
                >
                </i>
              </span>
              Hari
            </th>
            <th class="text-left">Jam</th>
            <th class="text-left">Lokasi</th>
            <th class="text-left">Penceramah</th>
            <th class="text-left">Bahasan</th>
          </tr>
        </thead>
        <tbody class="bg-grey-3">
          <tr
            v-for="kajian in kajians"
            :key="kajian.id"
            @click="redirect(kajian.id)"
            style="cursor:pointer"
          >
            <td class="text-left">{{ kajian.hari }}</td>
            <td class="text-left">
              {{ kajian.jam_mulai.slice(0,-3) }} - {{ kajian.jam_selesai.slice(0,-3) }}
            </td>
            <td class="text-left">
              {{
                kajian.masjid == null ? "Belum Ditentukan" : kajian.masjid.nama
              }}
            </td>
            <td class="text-left">
              {{ kajian.guru == null ? "Belum Ditentukan" : kajian.guru.nama }}
            </td>
            <td class="text-left">{{ kajian.bahasan }}</td>
          </tr>
        </tbody>
      </q-markup-table>
      <div class="q-ma-sm flex flex-center">
        <q-btn
          round
          color="primary"
          icon="arrow_left"
          v-if="pages.prev_page_url"
          @click="handleApi(pages.prev_page_url)"
        />
        <q-btn class="q-ma-sm" round color="primary" :label="pages.last_page" />
        to
        <q-btn class="q-ma-sm" round color="primary" :label="pages.to" />
        <q-btn
          class="q-ma-sm"
          round
          color="primary"
          icon="arrow_right"
          v-if="pages.next_page_url"
          @click="handleApi(pages.next_page_url)"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
// import moment from 'moment'
export default {
  data() {
    return {
      loading: true,
      kajians: {},
      pages: {},
      currnetSortDir: "asc",
      currentSortCol: "hari",
      search: ""
    };
  },
  methods: {
    // moment,
    // filteredKajians() {
    // return this.kajians.filter(c => {
    //     if (
    //     c["hari"].toLowerCase().indexOf(this.search.toLowerCase()) >
    //         -1
    //     )
    //     return c;
    // });
    // },
    sortBy(property, order) {
      this.currnetSortDir = order;
      return function(a, b) {
        const varA =
          typeof a[property] === "string"
            ? a[property].toUpperCase()
            : a[property];
        const varB =
          typeof b[property] === "string"
            ? b[property].toUpperCase()
            : b[property];

        let comparison = 0;
        if (varA > varB) comparison = 1;
        else if (varA < varB) comparison = -1;
        return order === "desc" ? comparison * -1 : comparison;
      };
    },
    sort(col) {
      this.pageNumber = 0;

      if (this.currentSortCol === col) {
        this.currentSortDir = this.currentSortDir === "asc" ? "desc" : "asc";
      } else {
        this.currentSortCol = col;
      }
      this.kajians.sort(this.sortBy(col, this.currentSortDir));
    },

    async loadSemuaKajian() {
      await this.$axios
        .get(`${process.env.API_URL}/api/v1/kajian`)
        .then(response => {
          this.pages = response.data;
          this.kajians = response.data.data;
        })
        .catch(error => {
          this.$q.notify({
            type: "negative",
            message: error.response.data.pesan
          });
        });
    },
    redirect(id) {
      return this.$router.replace(`/kajian/id/${id}`);
    },
    async handleApi(url) {
      await this.$axios
        .get(url)
        .then(response => {
          this.pages = response.data;
          this.kajians = response.data.data;
        })
        .catch(error => {
          this.$q.notify({
            type: "negative",
            message: error.response.data.pesan
          });
        });
    }
  },

  async created() {
    await this.loadSemuaKajian();
    this.loading = false;
  }
};
</script>
