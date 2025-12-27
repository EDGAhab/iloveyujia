/**
 * 压缩所有PNG文件并转换为JPG
 * 递归查找所有文件夹中的PNG文件
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 配置
const CONFIG = {
    // 压缩质量 (75 是好的平衡点)
    quality: 75,
    // 最大宽度（像素），超过会缩放
    maxWidth: 1920,
    // 最大高度（像素）
    maxHeight: 1920,
    // 是否转换为 JPG（PNG 转 JPG 会小很多）
    convertToJpg: true,
    // 要排除的文件夹（如 node_modules）
    excludeFolders: ['node_modules', '.git'],
    // 最小文件大小 (MB)，小于此大小的文件也会处理（因为PNG转JPG通常能减小很多）
    minSizeMB: 0
};

// 统计信息
const stats = {
    total: 0,
    converted: 0,
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
 * 递归查找所有PNG文件
 */
function findAllPngFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            // 跳过排除的文件夹
            if (!CONFIG.excludeFolders.includes(file)) {
                findAllPngFiles(filePath, fileList);
            }
        } else if (file.toLowerCase().endsWith('.png')) {
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

/**
 * 压缩并转换单个PNG图片
 */
async function convertPngToJpg(inputPath) {
    try {
        const originalSize = getFileSizeMB(inputPath);
        stats.originalSize += originalSize;
        stats.total++;

        const ext = path.extname(inputPath).toLowerCase();
        const baseName = path.basename(inputPath, ext);
        const dirName = path.dirname(inputPath);
        
        // 输出JPG文件路径
        const outputPath = path.join(dirName, baseName + '.jpg');
        const tempPath = outputPath + '.tmp';

        // 如果JPG文件已存在，跳过
        if (fs.existsSync(outputPath)) {
            console.log(`⏭️  跳过 (JPG已存在): ${path.basename(inputPath)}`);
            stats.skipped++;
            return;
        }

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

        // PNG 转 JPG
        await pipeline
            .jpeg({ 
                quality: CONFIG.quality, 
                mozjpeg: true 
            })
            .toFile(tempPath);

        const compressedSize = getFileSizeMB(tempPath);
        const saved = originalSize - compressedSize;
        const savedPercent = ((saved / originalSize) * 100).toFixed(1);

        // 重命名临时文件为最终文件
        fs.renameSync(tempPath, outputPath);
        
        // 删除原PNG文件
        fs.unlinkSync(inputPath);
        
        stats.compressedSize += compressedSize;
        stats.converted++;

        const sizeInfo = (resizeWidth !== width || resizeHeight !== height) 
            ? ` (${width}x${height} → ${resizeWidth}x${resizeHeight})`
            : '';
        
        console.log(`✅ 转换: ${path.basename(inputPath)} → ${baseName}.jpg${sizeInfo}`);
        console.log(`   ${originalSize.toFixed(2)}MB → ${compressedSize.toFixed(2)}MB (节省 ${savedPercent}%)`);
    } catch (error) {
        // 清理可能的临时文件
        const tempPath = inputPath.replace('.png', '.jpg.tmp');
        if (fs.existsSync(tempPath)) {
            try { fs.unlinkSync(tempPath); } catch {}
        }
        console.error(`❌ 错误: ${path.basename(inputPath)} - ${error.message}`);
        stats.errors++;
    }
}

/**
 * 主函数
 */
async function main() {
    console.log('🚀 开始查找并转换所有PNG文件...\n');
    console.log('配置:');
    console.log(`  - 质量: ${CONFIG.quality}`);
    console.log(`  - 最大尺寸: ${CONFIG.maxWidth}x${CONFIG.maxHeight}px`);
    console.log(`  - 转换为 JPG: ${CONFIG.convertToJpg ? '是' : '否'}`);
    console.log(`  - 排除文件夹: ${CONFIG.excludeFolders.join(', ')}\n`);

    // 检查是否安装了 sharp
    try {
        require('sharp');
    } catch (error) {
        console.error('❌ 错误: 未安装 sharp 库');
        console.log('\n请先运行: npm install sharp');
        process.exit(1);
    }

    // 从项目根目录开始查找所有PNG文件
    const rootDir = __dirname;
    console.log(`📁 搜索目录: ${rootDir}\n`);
    
    const pngFiles = findAllPngFiles(rootDir);
    
    console.log(`找到 ${pngFiles.length} 个PNG文件需要处理\n`);
    console.log('='.repeat(50) + '\n');

    // 处理每个PNG文件
    for (const pngFile of pngFiles) {
        await convertPngToJpg(pngFile);
        // 每个文件之间稍作延迟，避免系统资源问题
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    // 显示统计信息
    console.log('\n' + '='.repeat(50));
    console.log('📊 转换统计:');
    console.log(`   总PNG文件数: ${stats.total}`);
    console.log(`   已转换: ${stats.converted}`);
    console.log(`   已跳过: ${stats.skipped}`);
    console.log(`   错误: ${stats.errors}`);
    console.log(`   原始大小: ${stats.originalSize.toFixed(2)}MB`);
    console.log(`   转换后大小: ${stats.compressedSize.toFixed(2)}MB`);
    if (stats.originalSize > 0) {
        console.log(`   节省空间: ${(stats.originalSize - stats.compressedSize).toFixed(2)}MB`);
        console.log(`   压缩率: ${(((stats.originalSize - stats.compressedSize) / stats.originalSize) * 100).toFixed(1)}%`);
    }
    if (stats.converted > 0) {
        console.log(`   平均单张: ${(stats.compressedSize / stats.converted).toFixed(2)}MB`);
    }
    console.log('='.repeat(50));
    
    if (stats.converted > 0) {
        console.log('\n✅ 转换完成！所有PNG文件已转换为JPG');
    } else {
        console.log('\n⚠️  没有找到需要转换的PNG文件');
    }
}

// 运行
main().catch(console.error);

