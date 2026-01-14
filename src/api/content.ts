import request from '@/utils/request'

// 获取首页轮播图
export const getCmsdata = async (query:any) => {
    return await request.post('/api/r/cms/graphql',query)
}


// 获取首页轮播图
export const getBanners = async () => {
    return await request.post('/api/r/cms/banners')
}
