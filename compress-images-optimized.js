/**
 * 优化版图片压缩脚本
 * 转换为 JPG + 限制尺寸 + 降低质量
 * 目标：单张图片 500KB - 2MB
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 配置
const CONFIG = {
    // 压缩质量 (70-75 是好的平衡点，视觉差异很小)
    quality: 75,
    // 最大宽度（像素），超过会缩放
    maxWidth: 1920,
    // 最大高度（像素）
    maxHeight: 1920,
    // 是否转换为 JPG（PNG 转 JPG 会小很多）
    convertToJpg: true,
    // 要压缩的文件夹
    folders: ['photos', 'comics'],
    // 最大文件大小 (MB)，超过此大小的文件会被压缩
    maxSizeMB: 0.5
};

// 统计信息
const stats = {
    total: 0,
    compressed: 0,
    skipped: 0,
    errors: 0,
    originalSize: 0,
    compressedSize: 0
};

/**
 * 获取文件大小 (MB)
 */
function getFileSizeMB(filePath) {
    const stats = fs.statSync(filePath);
    return stats.size / (1024 * 1024);
}

/**
 * 压缩单个图片
 */
async function compressImage(inputPath) {
    try {
        const originalSize = getFileSizeMB(inputPath);
        stats.originalSize += originalSize;

        // 如果文件小于 maxSizeMB，跳过
        if (originalSize < CONFIG.maxSizeMB) {
            console.log(`⏭️  跳过 (${originalSize.toFixed(2)}MB < ${CONFIG.maxSizeMB}MB): ${path.basename(inputPath)}`);
            stats.skipped++;
            return;
        }

        // 创建临时文件路径
        const ext = path.extname(inputPath).toLowerCase();
        const baseName = path.basename(inputPath, ext);
        const dirName = path.dirname(inputPath);
        
        // 如果转换为 JPG，输出文件改为 .jpg
        const outputExt = (CONFIG.convertToJpg && ext === '.png') ? '.jpg' : ext;
        const tempPath = path.join(dirName, baseName + outputExt + '.tmp');

        // 获取图片元数据
        const metadata = await sharp(inputPath).metadata();
        const { width, height } = metadata;

        // 计算是否需要缩放
        let resizeWidth = width;
        let resizeHeight = height;
        
        if (width > CONFIG.maxWidth || height > CONFIG.maxHeight) {
            const ratio = Math.min(CONFIG.maxWidth / width, CONFIG.maxHeight / height);
            resizeWidth = Math.round(width * ratio);
            resizeHeight = Math.round(height * ratio);
        }

        // 构建 sharp 处理链
        let pipeline = sharp(inputPath);

        // 如果需要缩放
        if (resizeWidth !== width || resizeHeight !== height) {
            pipeline = pipeline.resize(resizeWidth, resizeHeight, {
                fit: 'inside',
                withoutEnlargement: true
            });
        }

        // 转换为 JPG 或压缩 PNG
        if (CONFIG.convertToJpg && ext === '.png') {
            // PNG 转 JPG
            await pipeline
                .jpeg({ 
                    quality: CONFIG.quality, 
                    mozjpeg: true 
                })
                .toFile(tempPath);
        } else if (ext === '.png') {
            // 压缩 PNG
            await pipeline
                .png({ 
                    quality: CONFIG.quality, 
                    compressionLevel: 9 
                })
                .toFile(tempPath);
        } else if (['.jpg', '.jpeg'].includes(ext)) {
            // 压缩 JPG
            await pipeline
                .jpeg({ 
                    quality: CONFIG.quality, 
                    mozjpeg: true 
                })
                .toFile(tempPath);
        } else {
            // 其他格式
            await pipeline.toFile(tempPath);
        }

        const compressedSize = getFileSizeMB(tempPath);
        const saved = originalSize - compressedSize;
        const savedPercent = ((saved / originalSize) * 100).toFixed(1);

        // 如果压缩后更小，替换原文件
        if (compressedSize < originalSize) {
            // 删除原文件
            fs.unlinkSync(inputPath);
            
            // 如果格式改变了，需要重命名
            const finalPath = path.join(dirName, baseName + outputExt);
            fs.renameSync(tempPath, finalPath);
            
            stats.compressedSize += compressedSize;
            stats.compressed++;

            const sizeInfo = (resizeWidth !== width || resizeHeight !== height) 
                ? ` (${width}x${height} → ${resizeWidth}x${resizeHeight})`
                : '';
            const formatInfo = (outputExt !== ext) ? ` [${ext.toUpperCase()}→${outputExt.toUpperCase()}]` : '';
            
            console.log(`✅ 压缩: ${path.basename(inputPath)}${formatInfo}${sizeInfo}`);
            console.log(`   ${originalSize.toFixed(2)}MB → ${compressedSize.toFixed(2)}MB (节省 ${savedPercent}%)`);
        } else {
            // 压缩后更大，删除临时文件，保留原文件
            fs.unlinkSync(tempPath);
            console.log(`⏭️  跳过: ${path.basename(inputPath)} (压缩后更大，保留原文件)`);
            stats.skipped++;
        }
    } catch (error) {
        // 清理可能的临时文件
        const tempPath = inputPath + '.tmp';
        if (fs.existsSync(tempPath)) {
            try { fs.unlinkSync(tempPath); } catch {}
        }
        console.error(`❌ 错误: ${path.basename(inputPath)} - ${error.message}`);
        stats.errors++;
    }
}

/**
 * 处理文件夹中的所有图片
 */
async function processFolder(folderPath) {
    if (!fs.existsSync(folderPath)) {
        console.log(`⚠️  文件夹不存在: ${folderPath}`);
        return;
    }

    const files = fs.readdirSync(folderPath);
    const imageFiles = files.filter(file => 
        /\.(png|jpg|jpeg)$/i.test(file)
    );

    console.log(`\n📁 处理文件夹: ${folderPath}`);
    console.log(`   找到 ${imageFiles.length} 张图片\n`);

    for (const file of imageFiles) {
        stats.total++;
        const inputPath = path.join(folderPath, file);
        await compressImage(inputPath);
    }
}

/**
 * 主函数
 */
async function main() {
    console.log('🚀 开始优化压缩图片...\n');
    console.log('配置:');
    console.log(`  - 质量: ${CONFIG.quality}`);
    console.log(`  - 最大尺寸: ${CONFIG.maxWidth}x${CONFIG.maxHeight}px`);
    console.log(`  - 转换为 JPG: ${CONFIG.convertToJpg ? '是' : '否'}`);
    console.log(`  - 最小压缩大小: ${CONFIG.maxSizeMB}MB\n`);

    // 检查是否安装了 sharp
    try {
        require('sharp');
    } catch (error) {
        console.error('❌ 错误: 未安装 sharp 库');
        console.log('\n请先运行: npm install sharp');
        process.exit(1);
    }

    // 处理所有文件夹
    for (const folder of CONFIG.folders) {
        const folderPath = path.join(__dirname, folder);
        
        // 如果是 comics 文件夹，需要处理子文件夹
        if (folder === 'comics') {
            const subfolders = fs.readdirSync(folderPath).filter(item => {
                const itemPath = path.join(folderPath, item);
                return fs.statSync(itemPath).isDirectory();
            });
            
            for (const subfolder of subfolders) {
                await processFolder(path.join(folderPath, subfolder));
            }
        } else {
            await processFolder(folderPath);
        }
    }

    // 显示统计信息
    console.log('\n' + '='.repeat(50));
    console.log('📊 压缩统计:');
    console.log(`   总文件数: ${stats.total}`);
    console.log(`   已压缩: ${stats.compressed}`);
    console.log(`   已跳过: ${stats.skipped}`);
    console.log(`   错误: ${stats.errors}`);
    console.log(`   原始大小: ${stats.originalSize.toFixed(2)}MB`);
    console.log(`   压缩后大小: ${stats.compressedSize.toFixed(2)}MB`);
    console.log(`   节省空间: ${(stats.originalSize - stats.compressedSize).toFixed(2)}MB`);
    console.log(`   压缩率: ${(((stats.originalSize - stats.compressedSize) / stats.originalSize) * 100).toFixed(1)}%`);
    console.log(`   平均单张: ${(stats.compressedSize / stats.compressed).toFixed(2)}MB`);
    console.log('='.repeat(50));
    
    if (stats.compressedSize / stats.compressed > 2) {
        console.log('\n⚠️  警告: 平均单张图片仍超过 2MB，建议进一步优化');
    } else {
        console.log('\n✅ 优化完成！图片大小已适合网页加载');
    }
}

// 运行
main().catch(console.error);

