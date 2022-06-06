export const state = () => ({
  currentPassword: 'کلمه عبور فعلی',
  setAdmin: 'تنظیم کاربر به عنوان مدیر',
  resetFactory: 'تنظیمات کارخانه',
  activateAntiTheft: 'فعال کردن دزدگیر',
  deactivateAntiTheft: 'غیرفعال کردن دزدگیر',
  changeDevicePassword: 'تغییر کلمه عبور دستگاه',
  simCardCredit: 'اعتبار سیم‌کارت',
  deviceAntenQuality: 'کیفیت آنتن‌دهی دستگاه',
  getTemperature: 'دریافت دما',
  getAdminList: 'دریافت لیست مدیرها',
  removeAdmin: 'حذف مدیر',
  fullname: 'نام و نام خانوادگی',
  phone: 'شماره تلفن',
  city: 'شهر',
  email: 'ایمیل'
})
export const mutations = {

}
export const getters = {
  getTranslate: state => (key) => {
    return state[key]
  }
}
