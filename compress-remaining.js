/**
 * 压缩剩余 PNG 文件的脚本
 * 只处理 photos 文件夹中剩余的 PNG 文件
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 配置
const CONFIG = {
    quality: 75,
    maxWidth: 1920,
    maxHeight: 1920,
    convertToJpg: true,
    maxSizeMB: 0.5
};

const stats = {
    total: 0,
    compressed: 0,
    skipped: 0,
    errors: 0,
    originalSize: 0,
    compressedSize: 0
};

function getFileSizeMB(filePath) {
    const stats = fs.statSync(filePath);
    return stats.size / (1024 * 1024);
}

async function compressImage(inputPath) {
    try {
        const originalSize = getFileSizeMB(inputPath);
        stats.originalSize += originalSize;

        if (originalSize < CONFIG.maxSizeMB) {
            console.log(`⏭️  跳过 (${originalSize.toFixed(2)}MB < ${CONFIG.maxSizeMB}MB): ${path.basename(inputPath)}`);
            stats.skipped++;
            return;
        }

        const ext = path.extname(inputPath).toLowerCase();
        const baseName = path.basename(inputPath, ext);
        const dirName = path.dirname(inputPath);
        const outputExt = (CONFIG.convertToJpg && ext === '.png') ? '.jpg' : ext;
        const tempPath = path.join(dirName, baseName + outputExt + '.tmp');

        const metadata = await sharp(inputPath).metadata();
        const { width, height } = metadata;

        let resizeWidth = width;
        let resizeHeight = height;
        
        if (width > CONFIG.maxWidth || height > CONFIG.maxHeight) {
            const ratio = Math.min(CONFIG.maxWidth / width, CONFIG.maxHeight / height);
            resizeWidth = Math.round(width * ratio);
            resizeHeight = Math.round(height * ratio);
        }

        let pipeline = sharp(inputPath);

        if (resizeWidth !== width || resizeHeight !== height) {
            pipeline = pipeline.resize(resizeWidth, resizeHeight, {
                fit: 'inside',
                withoutEnlargement: true
            });
        }

        if (CONFIG.convertToJpg && ext === '.png') {
            await pipeline
                .jpeg({ quality: CONFIG.quality, mozjpeg: true })
                .toFile(tempPath);
        } else if (ext === '.png') {
            await pipeline
                .png({ quality: CONFIG.quality, compressionLevel: 9 })
                .toFile(tempPath);
        } else {
            await pipeline.toFile(tempPath);
        }

        const compressedSize = getFileSizeMB(tempPath);
        const saved = originalSize - compressedSize;
        const savedPercent = ((saved / originalSize) * 100).toFixed(1);

        if (compressedSize < originalSize) {
            // 等待一小段时间，确保文件没有被占用
            await new Promise(resolve => setTimeout(resolve, 100));
            
            try {
                fs.unlinkSync(inputPath);
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
            } catch (error) {
                // 如果删除失败，保留原文件
                if (fs.existsSync(tempPath)) {
                    fs.unlinkSync(tempPath);
                }
                throw error;
            }
        } else {
            fs.unlinkSync(tempPath);
            console.log(`⏭️  跳过: ${path.basename(inputPath)} (压缩后更大)`);
            stats.skipped++;
        }
    } catch (error) {
        const tempPath = inputPath + '.tmp';
        if (fs.existsSync(tempPath)) {
            try { fs.unlinkSync(tempPath); } catch {}
        }
        console.error(`❌ 错误: ${path.basename(inputPath)} - ${error.message}`);
        stats.errors++;
    }
}

async function main() {
    console.log('🚀 开始压缩剩余的 PNG 文件...\n');

    try {
        require('sharp');
    } catch (error) {
        console.error('❌ 错误: 未安装 sharp 库');
        console.log('\n请先运行: npm install sharp');
        process.exit(1);
    }

    const photosPath = path.join(__dirname, 'photos');
    const files = fs.readdirSync(photosPath);
    const pngFiles = files.filter(file => /\.png$/i.test(file));

    console.log(`找到 ${pngFiles.length} 个 PNG 文件需要处理\n`);

    for (const file of pngFiles) {
        stats.total++;
        const inputPath = path.join(photosPath, file);
        await compressImage(inputPath);
        // 每个文件之间稍作延迟，避免权限问题
        await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 压缩统计:');
    console.log(`   总文件数: ${stats.total}`);
    console.log(`   已压缩: ${stats.compressed}`);
    console.log(`   已跳过: ${stats.skipped}`);
    console.log(`   错误: ${stats.errors}`);
    console.log(`   原始大小: ${stats.originalSize.toFixed(2)}MB`);
    console.log(`   压缩后大小: ${stats.compressedSize.toFixed(2)}MB`);
    console.log(`   节省空间: ${(stats.originalSize - stats.compressedSize).toFixed(2)}MB`);
    if (stats.compressed > 0) {
        console.log(`   压缩率: ${(((stats.originalSize - stats.compressedSize) / stats.originalSize) * 100).toFixed(1)}%`);
        console.log(`   平均单张: ${(stats.compressedSize / stats.compressed).toFixed(2)}MB`);
    }
    console.log('='.repeat(50));
}

main().catch(console.error);


