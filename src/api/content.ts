import request from '@/utils/request'

// 获取首页轮播图
export const getBannerImages = async () => {
    return await request.get('/api/r/cms/banners')
}
